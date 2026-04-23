/**
 * Deterministic medical triage conversation engine.
 *
 * Not a diagnosis system — it collects symptom details the way a Nigerian GP
 * would, applies established red-flag rules, and returns a structured
 * assessment (EMERGENCY / URGENT / ROUTINE) with recommended specialty and
 * self-care advice. Designed to feel like a real clinical conversation.
 *
 * Flow:
 *   1. Identify the primary complaint category from free-text keywords.
 *   2. Walk through a small question tree for that category (SOCRATES-like:
 *      Site, Onset, Character, Radiation, Associations, Time, Exacerbators,
 *      Severity).
 *   3. After the tree is exhausted OR a red flag fires, finalize.
 *
 * All content is plain data — easy to extend with Firebase/OpenAI later.
 */

export type Urgency = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export type Assessment = {
  urgency: Urgency;
  action: string;
  specialty: string;
  redFlags: string[];
  selfCare: string[];
};

type Option = {
  label: string;
  value: string;
  redFlag?: string;
  // If picking this option short-circuits everything:
  escalate?: Urgency;
};

type Question = {
  id: string;
  prompt: string;
  options: Option[];
  allowText?: boolean; // allow free-text answer in addition to options
};

type Category = {
  id: string;
  name: string;
  matches: RegExp; // keywords from opening message
  opening: string; // clinician's first acknowledgement
  questions: Question[];
  finalize: (answers: Record<string, string>, redFlags: string[]) => Assessment;
};

// ───────────────────────────────────────────────────────────────────────────

const CHEST_PAIN: Category = {
  id: 'chest_pain',
  name: 'Chest pain',
  matches: /chest\s*(pain|tightness|pressure|discomfort)|heart\s*(attack|pain)|left\s*arm/i,
  opening:
    "Thank you for telling me. Chest symptoms always deserve careful attention. I'll ask a few quick questions.",
  questions: [
    {
      id: 'onset',
      prompt: 'When did the chest pain start?',
      options: [
        { label: 'Just now — in the last 30 minutes', value: 'acute', redFlag: 'Very recent onset', escalate: 'EMERGENCY' },
        { label: 'A few hours ago, today', value: 'today' },
        { label: 'Several days ago', value: 'days' },
        { label: 'Weeks or longer', value: 'weeks' }
      ]
    },
    {
      id: 'character',
      prompt: 'How would you describe the pain?',
      options: [
        { label: 'Crushing or squeezing', value: 'crushing', redFlag: 'Crushing chest pain', escalate: 'EMERGENCY' },
        { label: 'Sharp / stabbing', value: 'sharp' },
        { label: 'Burning', value: 'burning' },
        { label: 'Dull ache', value: 'dull' }
      ]
    },
    {
      id: 'radiation',
      prompt: 'Does the pain spread anywhere?',
      options: [
        { label: 'To my left arm, jaw or back', value: 'cardiac', redFlag: 'Radiation to arm/jaw/back', escalate: 'EMERGENCY' },
        { label: 'To my right shoulder', value: 'right_shoulder' },
        { label: 'Stays in the chest', value: 'local' }
      ]
    },
    {
      id: 'associated',
      prompt: 'Do you also have any of these?',
      options: [
        { label: 'Shortness of breath or sweating', value: 'sob_sweat', redFlag: 'SOB with chest pain', escalate: 'EMERGENCY' },
        { label: 'Nausea or dizziness', value: 'nausea' },
        { label: 'Heartburn after eating', value: 'reflux' },
        { label: 'None of the above', value: 'none' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.length) {
      return {
        urgency: 'EMERGENCY',
        action:
          'Please call 112 or go to the nearest emergency room now. Do not drive yourself — ask a family member or a neighbour. While waiting, chew one adult aspirin 300 mg if you are not allergic and sit upright.',
        specialty: 'Emergency Medicine · Cardiology',
        redFlags: rf,
        selfCare: ['Sit upright and rest', 'Chew aspirin 300 mg if not allergic', 'Stay with someone until help arrives']
      };
    }
    if (a.character === 'burning' && a.associated === 'reflux') {
      return {
        urgency: 'ROUTINE',
        action:
          'This pattern is most consistent with acid reflux. Book a General Medicine appointment this week. Keep a food diary in the meantime.',
        specialty: 'General Medicine',
        redFlags: [],
        selfCare: [
          'Avoid very spicy or fatty foods',
          'Eat small meals and do not lie down for 2 hours after eating',
          'Try antacids after meals'
        ]
      };
    }
    return {
      urgency: 'URGENT',
      action:
        'Please see a doctor today or tomorrow. You should not wait more than 24 hours with chest symptoms. If anything worsens, call 112 immediately.',
      specialty: 'Cardiology',
      redFlags: rf,
      selfCare: ['Avoid strenuous activity', 'Monitor your pulse and breathing']
    };
  }
};

const FEVER: Category = {
  id: 'fever',
  name: 'Fever / feeling hot',
  matches: /fever|hot\s*body|temperature|chills|shivering|malaria/i,
  opening:
    'Sorry you are feeling unwell. Fever in our region often means malaria — but I will ask a few questions first.',
  questions: [
    {
      id: 'duration',
      prompt: 'How long have you had the fever?',
      options: [
        { label: 'Less than 1 day', value: '<1' },
        { label: '1–3 days', value: '1-3' },
        { label: '4–7 days', value: '4-7' },
        { label: 'More than a week', value: '>7', redFlag: 'Fever > 7 days' }
      ]
    },
    {
      id: 'severity',
      prompt: 'How high is the temperature (if you measured)?',
      options: [
        { label: 'I have not measured', value: 'unknown' },
        { label: 'Mild (< 38.5 °C)', value: 'mild' },
        { label: 'High (38.5–39.9 °C)', value: 'high' },
        { label: 'Very high (≥ 40 °C)', value: 'veryhigh', redFlag: 'Temperature ≥ 40 °C' }
      ]
    },
    {
      id: 'associated',
      prompt: 'Do you also have any of these?',
      options: [
        {
          label: 'Stiff neck, severe headache or confusion',
          value: 'meningeal',
          redFlag: 'Meningeal signs',
          escalate: 'EMERGENCY'
        },
        { label: 'Difficulty breathing', value: 'sob', redFlag: 'SOB with fever', escalate: 'EMERGENCY' },
        { label: 'Body aches and headache', value: 'bodyache' },
        { label: 'Vomiting or diarrhoea', value: 'gi' },
        { label: 'None of the above', value: 'none' }
      ]
    },
    {
      id: 'who',
      prompt: 'Who has the fever?',
      options: [
        { label: 'Adult (me)', value: 'adult' },
        { label: 'Child < 5 years', value: 'child_u5', redFlag: 'Fever in child < 5' },
        { label: 'Pregnant woman', value: 'pregnant', redFlag: 'Fever in pregnancy' },
        { label: 'Elderly (65+)', value: 'elderly' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.some((f) => f.includes('Meningeal') || f.includes('SOB'))) {
      return {
        urgency: 'EMERGENCY',
        action:
          'These symptoms with fever can be life-threatening. Please go to the emergency room now or call 112.',
        specialty: 'Emergency Medicine',
        redFlags: rf,
        selfCare: ['Do not take any sedatives', 'Keep hydrated if you can']
      };
    }
    if (a.who === 'pregnant' || a.who === 'child_u5' || a.severity === 'veryhigh') {
      return {
        urgency: 'URGENT',
        action:
          'This is urgent. Please book an appointment today. Malaria, typhoid and similar infections are treatable but need prompt care. Consider a malaria rapid test at the hospital.',
        specialty: a.who === 'child_u5' ? 'Pediatrics' : 'General Medicine',
        redFlags: rf,
        selfCare: [
          'Paracetamol for fever (respect dose by age/weight)',
          'Drink ORS, water, fruits',
          'Tepid sponging for high fever'
        ]
      };
    }
    return {
      urgency: a.duration === '>7' ? 'URGENT' : 'ROUTINE',
      action:
        a.duration === '>7'
          ? 'Fever lasting more than a week deserves evaluation this week — book a General Medicine appointment. Consider a malaria and typhoid screen.'
          : 'This sounds like a common febrile illness — most often malaria or a viral infection in our setting. Book a General Medicine appointment within a few days; come sooner if it worsens.',
      specialty: 'General Medicine',
      redFlags: rf,
      selfCare: [
        'Paracetamol 500 mg–1 g every 6 hours for adults as needed',
        'Plenty of fluids (ORS is excellent)',
        'Rest; avoid self-medicating with antibiotics'
      ]
    };
  }
};

const HEADACHE: Category = {
  id: 'headache',
  name: 'Headache',
  matches: /headache|migraine|head\s*pain/i,
  opening: 'Headaches can be many different things. A few quick questions will help me guide you.',
  questions: [
    {
      id: 'onset',
      prompt: 'How did the headache start?',
      options: [
        { label: 'Suddenly — the worst headache of my life', value: 'thunderclap', redFlag: 'Thunderclap headache', escalate: 'EMERGENCY' },
        { label: 'Gradually over hours', value: 'gradual' },
        { label: 'It comes and goes', value: 'recurrent' }
      ]
    },
    {
      id: 'associated',
      prompt: 'Do you also have any of these?',
      options: [
        { label: 'Neck stiffness or fever', value: 'meningeal', redFlag: 'Meningism', escalate: 'EMERGENCY' },
        { label: 'New weakness, slurred speech or facial droop', value: 'stroke', redFlag: 'Stroke symptoms', escalate: 'EMERGENCY' },
        { label: 'Nausea or sensitivity to light', value: 'migraine' },
        { label: 'Blurry vision', value: 'vision' },
        { label: 'None of the above', value: 'none' }
      ]
    },
    {
      id: 'severity',
      prompt: 'On a scale of 1–10, how bad is the pain?',
      options: [
        { label: 'Mild (1–3)', value: 'mild' },
        { label: 'Moderate (4–6)', value: 'moderate' },
        { label: 'Severe (7–10)', value: 'severe' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.length) {
      return {
        urgency: 'EMERGENCY',
        action:
          'These features suggest something that needs emergency evaluation right now. Please call 112 or go directly to the ER.',
        specialty: 'Emergency Medicine · Neurology',
        redFlags: rf,
        selfCare: ['Do not drive', 'Stay with someone who can help']
      };
    }
    if (a.associated === 'migraine' && a.severity === 'severe') {
      return {
        urgency: 'URGENT',
        action:
          'This sounds like a severe migraine. Book a Neurology or General Medicine appointment today or tomorrow.',
        specialty: 'Neurology',
        redFlags: [],
        selfCare: [
          'Rest in a dark quiet room',
          'Paracetamol or ibuprofen (if you have no stomach ulcer)',
          'Hydrate and avoid skipping meals'
        ]
      };
    }
    return {
      urgency: 'ROUTINE',
      action: 'Book a General Medicine appointment this week. If pain worsens or the red-flag symptoms appear, come to the hospital sooner.',
      specialty: 'General Medicine',
      redFlags: [],
      selfCare: ['Paracetamol 1 g PRN', 'Adequate sleep', 'Keep hydrated, limit caffeine']
    };
  }
};

const CHILD_ILLNESS: Category = {
  id: 'child',
  name: 'Child unwell',
  matches: /child|baby|toddler|paediat|pediat|my\s*son|my\s*daughter|rash/i,
  opening: 'I am sorry your child is unwell. A few quick questions will help me guide you to the right care.',
  questions: [
    {
      id: 'age',
      prompt: "How old is your child?",
      options: [
        { label: 'Newborn — under 3 months', value: 'newborn', redFlag: 'Newborn under 3 months ill', escalate: 'EMERGENCY' },
        { label: '3 months – 5 years', value: 'u5' },
        { label: '5 – 12 years', value: 'child' },
        { label: 'Teenager', value: 'teen' }
      ]
    },
    {
      id: 'danger',
      prompt: 'Are any of these present?',
      options: [
        { label: 'Fast breathing / chest indrawing', value: 'breathing', redFlag: 'Paediatric respiratory distress', escalate: 'EMERGENCY' },
        { label: 'Not feeding or very weak', value: 'weak', redFlag: 'Unable to feed', escalate: 'EMERGENCY' },
        { label: 'Convulsions', value: 'convulsion', redFlag: 'Convulsion', escalate: 'EMERGENCY' },
        { label: 'Fever and rash', value: 'rash' },
        { label: 'None of the above', value: 'none' }
      ]
    },
    {
      id: 'duration',
      prompt: 'How long has this been going on?',
      options: [
        { label: 'Less than 24 hours', value: '<24' },
        { label: '1–3 days', value: '1-3' },
        { label: 'More than 3 days', value: '>3' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.length) {
      return {
        urgency: 'EMERGENCY',
        action: 'Please bring your child to the emergency room immediately or call 112.',
        specialty: 'Pediatrics · Emergency',
        redFlags: rf,
        selfCare: ['Keep baby warm', 'Offer small sips of fluids', 'Do not give unprescribed medicine']
      };
    }
    return {
      urgency: a.duration === '>3' ? 'URGENT' : 'URGENT',
      action: 'Please book a paediatrics appointment today. Children can deteriorate quickly — early review is always safer.',
      specialty: 'Pediatrics',
      redFlags: [],
      selfCare: ['Offer fluids often', 'Paracetamol weight-based dose for fever', 'Return immediately if breathing worsens or child becomes drowsy']
    };
  }
};

const ABDOMINAL: Category = {
  id: 'abdo',
  name: 'Abdominal pain',
  matches: /stomach|abdom|belly|tummy|vomit|diarr/i,
  opening: 'Tummy problems can come from many causes. Let me ask a few questions.',
  questions: [
    {
      id: 'site',
      prompt: 'Where is the pain?',
      options: [
        { label: 'Lower right (around the appendix)', value: 'rlq', redFlag: 'RLQ pain — possible appendicitis' },
        { label: 'Upper abdomen / chest area', value: 'upper' },
        { label: 'All over', value: 'generalised' },
        { label: 'Lower abdomen', value: 'lower' }
      ]
    },
    {
      id: 'associated',
      prompt: 'Do you have any of these?',
      options: [
        { label: 'Blood in vomit or stool', value: 'bleed', redFlag: 'GI bleeding', escalate: 'EMERGENCY' },
        { label: 'Severe non-stop vomiting', value: 'vomit', redFlag: 'Persistent vomiting' },
        { label: 'Fever > 38 °C', value: 'fever' },
        { label: 'Pain worsens with movement', value: 'movement' },
        { label: 'None of the above', value: 'none' }
      ]
    },
    {
      id: 'severity',
      prompt: 'How bad is the pain (1–10)?',
      options: [
        { label: 'Mild (1–3)', value: 'mild' },
        { label: 'Moderate (4–6)', value: 'moderate' },
        { label: 'Severe (7–10)', value: 'severe', redFlag: 'Severe abdominal pain' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.some((f) => f.includes('GI bleeding'))) {
      return {
        urgency: 'EMERGENCY',
        action: 'Please go to the emergency room or call 112 now.',
        specialty: 'Emergency Medicine',
        redFlags: rf,
        selfCare: ['Nothing by mouth', 'Lie on your side']
      };
    }
    if (a.site === 'rlq' || a.severity === 'severe' || rf.length) {
      return {
        urgency: 'URGENT',
        action: 'Please come to the hospital today for evaluation. Appendicitis and similar conditions are safer treated early.',
        specialty: 'General Medicine · Surgery',
        redFlags: rf,
        selfCare: ['Avoid painkillers like ibuprofen before review', 'Avoid eating heavy food until seen']
      };
    }
    return {
      urgency: 'ROUTINE',
      action: 'Book a General Medicine appointment this week. If vomiting or severe pain develops, come sooner.',
      specialty: 'General Medicine',
      redFlags: [],
      selfCare: ['Bland food, small meals', 'ORS if there is diarrhoea or vomiting', 'Avoid very fatty/spicy food']
    };
  }
};

const COUGH: Category = {
  id: 'cough',
  name: 'Cough / breathing',
  matches: /cough|phlegm|catarrh|breath|wheez/i,
  opening: 'Let me ask a few questions to understand your breathing symptoms.',
  questions: [
    {
      id: 'duration',
      prompt: 'How long have you had the cough?',
      options: [
        { label: 'A few days', value: '<1w' },
        { label: '1–3 weeks', value: '1-3w' },
        { label: 'More than 3 weeks', value: '>3w', redFlag: 'Chronic cough > 3 weeks — TB screen' }
      ]
    },
    {
      id: 'blood',
      prompt: 'Have you coughed up any blood?',
      options: [
        { label: 'Yes', value: 'yes', redFlag: 'Haemoptysis' },
        { label: 'No', value: 'no' }
      ]
    },
    {
      id: 'associated',
      prompt: 'Do you have any of these?',
      options: [
        { label: 'Difficulty breathing at rest', value: 'sob', redFlag: 'SOB at rest', escalate: 'EMERGENCY' },
        { label: 'Chest pain with coughing', value: 'pain' },
        { label: 'Fever and chills', value: 'fever' },
        { label: 'Night sweats or weight loss', value: 'tb', redFlag: 'TB-suggestive features' },
        { label: 'None of the above', value: 'none' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.some((f) => f.includes('SOB at rest'))) {
      return {
        urgency: 'EMERGENCY',
        action: 'Please come to the hospital or call 112 now.',
        specialty: 'Emergency Medicine',
        redFlags: rf,
        selfCare: ['Sit upright', 'Loosen tight clothing']
      };
    }
    if (rf.length) {
      return {
        urgency: 'URGENT',
        action: 'Please book an appointment today. A chest X-ray and sputum test may be needed.',
        specialty: 'General Medicine',
        redFlags: rf,
        selfCare: ['Cover your cough', 'Stay well-hydrated', 'Avoid smoking and second-hand smoke']
      };
    }
    return {
      urgency: 'ROUTINE',
      action: 'Book a General Medicine appointment this week. If breathing worsens, come sooner.',
      specialty: 'General Medicine',
      redFlags: [],
      selfCare: ['Warm fluids and honey (> 1 yr)', 'Paracetamol for fever', 'Avoid dust and smoke']
    };
  }
};

const URINARY: Category = {
  id: 'urinary',
  name: 'Urinary symptoms',
  matches: /urin|pee|wee|burning\s*when/i,
  opening: 'Urinary symptoms are common and usually treatable. A few quick questions.',
  questions: [
    {
      id: 'pain',
      prompt: 'Do you have pain or burning when urinating?',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
    },
    {
      id: 'blood',
      prompt: 'Is there blood in your urine?',
      options: [
        { label: 'Yes', value: 'yes', redFlag: 'Haematuria' },
        { label: 'No', value: 'no' }
      ]
    },
    {
      id: 'fever',
      prompt: 'Do you have fever or flank (back) pain?',
      options: [
        { label: 'Yes', value: 'yes', redFlag: 'Possible pyelonephritis' },
        { label: 'No', value: 'no' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.length) {
      return {
        urgency: 'URGENT',
        action: 'Please book an appointment today. A urine test and possibly antibiotics are needed.',
        specialty: 'General Medicine',
        redFlags: rf,
        selfCare: ['Drink plenty of water', 'Avoid caffeine and alcohol']
      };
    }
    return {
      urgency: 'ROUTINE',
      action: 'Book a General Medicine appointment within a few days for a urine test.',
      specialty: 'General Medicine',
      redFlags: [],
      selfCare: ['Drink plenty of water', 'Wipe front to back', 'Do not hold urine for long']
    };
  }
};

const GENERAL: Category = {
  id: 'general',
  name: 'Other concern',
  matches: /.*/i,
  opening:
    'Thanks for reaching out. Let me gather a bit more information so I can guide you properly.',
  questions: [
    {
      id: 'duration',
      prompt: 'How long have you been feeling this way?',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'A few days', value: 'days' },
        { label: 'Weeks', value: 'weeks' },
        { label: 'Longer', value: 'longer' }
      ]
    },
    {
      id: 'severity',
      prompt: 'How is it affecting your day?',
      options: [
        { label: 'I cannot work / go to school', value: 'severe', redFlag: 'Significant impairment' },
        { label: 'Uncomfortable but I manage', value: 'moderate' },
        { label: 'Mild — mostly fine', value: 'mild' }
      ]
    },
    {
      id: 'redflag',
      prompt: 'Are any of these present?',
      options: [
        { label: 'Loss of consciousness or confusion', value: 'loc', redFlag: 'Altered consciousness', escalate: 'EMERGENCY' },
        { label: 'Heavy bleeding', value: 'bleed', redFlag: 'Heavy bleeding', escalate: 'EMERGENCY' },
        { label: 'Difficulty breathing', value: 'sob', redFlag: 'Difficulty breathing', escalate: 'EMERGENCY' },
        { label: 'None of the above', value: 'none' }
      ]
    }
  ],
  finalize: (a, rf) => {
    if (rf.length) {
      return {
        urgency: 'EMERGENCY',
        action: 'Please come to the hospital immediately or call 112.',
        specialty: 'Emergency Medicine',
        redFlags: rf,
        selfCare: ['Stay with someone who can help you']
      };
    }
    if (a.severity === 'severe' || a.duration === 'longer') {
      return {
        urgency: 'URGENT',
        action: 'Please book a General Medicine appointment today or tomorrow.',
        specialty: 'General Medicine',
        redFlags: [],
        selfCare: ['Rest', 'Stay hydrated', 'Keep a simple symptom diary for your doctor']
      };
    }
    return {
      urgency: 'ROUTINE',
      action: 'A routine consultation this week should be enough. If anything worsens, come sooner.',
      specialty: 'General Medicine',
      redFlags: [],
      selfCare: ['Rest well', 'Stay hydrated', 'Eat balanced meals']
    };
  }
};

const CATEGORIES: Category[] = [
  CHEST_PAIN,
  CHILD_ILLNESS,
  HEADACHE,
  FEVER,
  COUGH,
  URINARY,
  ABDOMINAL,
  GENERAL
];

export function classifyOpening(text: string): Category {
  const lower = text.toLowerCase();
  for (const c of CATEGORIES) {
    if (c.id !== 'general' && c.matches.test(lower)) return c;
  }
  return GENERAL;
}

export type Session = {
  category: Category;
  step: number; // index into category.questions
  answers: Record<string, string>;
  redFlags: string[];
  done: boolean;
  escalateNow?: Urgency;
};

export function startSession(openingText: string): {
  session: Session;
  firstMessage: string;
  firstQuestion: Question;
} {
  const category = classifyOpening(openingText);
  const session: Session = {
    category,
    step: 0,
    answers: {},
    redFlags: [],
    done: false
  };
  return {
    session,
    firstMessage: category.opening,
    firstQuestion: category.questions[0]
  };
}

export function answerQuestion(
  session: Session,
  optionValue: string
): {
  session: Session;
  nextQuestion?: Question;
  assessment?: Assessment;
} {
  const q = session.category.questions[session.step];
  const opt = q.options.find((o) => o.value === optionValue);
  const newAnswers = { ...session.answers, [q.id]: optionValue };
  const newRedFlags = opt?.redFlag
    ? [...session.redFlags, opt.redFlag]
    : session.redFlags;

  const escalated = opt?.escalate;
  const nextStep = session.step + 1;
  const lastQuestion = nextStep >= session.category.questions.length;

  if (escalated === 'EMERGENCY' || lastQuestion) {
    const assessment = session.category.finalize(newAnswers, newRedFlags);
    return {
      session: {
        ...session,
        answers: newAnswers,
        redFlags: newRedFlags,
        step: nextStep,
        done: true,
        escalateNow: escalated
      },
      assessment
    };
  }

  return {
    session: {
      ...session,
      answers: newAnswers,
      redFlags: newRedFlags,
      step: nextStep
    },
    nextQuestion: session.category.questions[nextStep]
  };
}

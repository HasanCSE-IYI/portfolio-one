import {
  RESUME_META,
  PROFESSIONAL_SUMMARY,
  TECHNICAL_SKILLS,
  FEATURED_PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION,
  LANGUAGES,
  ADDITIONAL_ACTIVITIES,
  REFERENCES,
  getPlainTextResume,
} from './resumeData';

describe('resumeData Model & Generator', () => {
  test('RESUME_META has complete contact and profile metadata', () => {
    expect(RESUME_META.name).toBe('Mahmud al Hasan');
    expect(RESUME_META.email).toBe('mahmud.csem@gmail.com');
    expect(RESUME_META.location).toContain('Chattogram');
    expect(RESUME_META.phone).toBeDefined();
    expect(RESUME_META.github).toContain('github.com');
    expect(RESUME_META.linkedin).toContain('linkedin.com');
  });

  test('TECHNICAL_SKILLS has .NET Core & C# competencies', () => {
    const dotnetSkill = TECHNICAL_SKILLS.find((s) => s.category.includes('.NET'));
    expect(dotnetSkill).toBeDefined();
    expect(dotnetSkill.items).toContain('ASP.NET Core Web API');
    expect(PROFESSIONAL_SUMMARY).toContain('ASP.NET Core');
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
    expect(EDUCATION.degree).toBeDefined();
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(2);
    expect(ADDITIONAL_ACTIVITIES.length).toBeGreaterThan(0);
  });

  test('WORK_EXPERIENCE preserves authentic career timeline and achievements', () => {
    expect(WORK_EXPERIENCE.length).toBeGreaterThan(0);
    const doctorDekhao = WORK_EXPERIENCE.find((w) => w.company.includes('Doctor Dekhao'));
    expect(doctorDekhao).toBeDefined();
  });

  test('REFERENCES strictly preserves both professional references (Constraint 2b)', () => {
    expect(REFERENCES.length).toBe(2);
    expect(REFERENCES[0].name).toBe('Habibur Rahman');
    expect(REFERENCES[0].email).toBe('habib2498922@gmail.com');
    expect(REFERENCES[1].name).toBe('IFTEKHAR UDDIN MD. TANVIR');
    expect(REFERENCES[1].email).toBe('eng.iftekhar@gmail.com');
  });

  test('getPlainTextResume outputs a complete plain text resume with all sections', () => {
    const text = getPlainTextResume();
    expect(typeof text).toBe('string');
    expect(text).toContain('MAHMUD AL HASAN');
    expect(text).toContain('PROFESSIONAL SUMMARY');
    expect(text).toContain('TECHNICAL SKILLS');
    expect(text).toContain('WORK EXPERIENCE');
    expect(text).toContain('EDUCATION');
    expect(text).toContain('PROFESSIONAL REFERENCES');
    expect(text).toContain('Habibur Rahman');
    expect(text).toContain('IFTEKHAR UDDIN MD. TANVIR');
  });
});

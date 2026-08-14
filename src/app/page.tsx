import SchoolExperience from "@/app/components/SchoolExperience";
import { db } from "@/db";
import { campusEvents, programs } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

const learningStageSeed = [
  {
    slug: "early-years",
    title: "Early Years",
    degree: "Ages 3–5",
    description: "Purposeful play builds language, independence, friendships, and a lifelong love of discovery.",
    duration: "3 joyful years",
    icon: "early",
    featured: true,
  },
  {
    slug: "primary-school",
    title: "Primary School",
    degree: "Grades 1–5",
    description: "Strong foundations in literacy and numeracy grow through inquiry, creativity, and real-world connections.",
    duration: "5 foundation years",
    icon: "primary",
    featured: true,
  },
  {
    slug: "middle-school",
    title: "Middle School",
    degree: "Grades 6–8",
    description: "Learners find their voice, explore new disciplines, and develop the confidence to think independently.",
    duration: "3 discovery years",
    icon: "middle",
    featured: true,
  },
  {
    slug: "senior-school",
    title: "Senior School",
    degree: "Grades 9–12",
    description: "Rigorous academics, expert guidance, and leadership opportunities prepare every learner for what comes next.",
    duration: "4 future-ready years",
    icon: "secondary",
    featured: true,
  },
  {
    slug: "steam-innovation",
    title: "STEAM & Innovation",
    degree: "Across all grades",
    description: "Coding, design, robotics, science, and making turn complex questions into purposeful student-led solutions.",
    duration: "Weekly specialist learning",
    icon: "steam",
    featured: true,
  },
  {
    slug: "arts-sport-leadership",
    title: "Arts, Sport & Leadership",
    degree: "Across all grades",
    description: "Music, visual arts, theatre, sport, and service help children discover strengths beyond the classroom.",
    duration: "Year-round enrichment",
    icon: "arts",
    featured: true,
  },
];

const schoolEventSeed = [
  {
    slug: "open-morning-campus-tour-2026",
    title: "Horizon Open Morning & Campus Tour",
    eventDate: "2026-09-19",
    startTime: "9:00 AM – 12:00 PM",
    location: "Welcome Centre",
    category: "For prospective families",
  },
  {
    slug: "meet-our-teachers-2026",
    title: "Meet Our Teachers: Learning at Horizon",
    eventDate: "2026-10-02",
    startTime: "5:30 PM – 7:00 PM",
    location: "Discovery Library",
    category: "Parent evening",
  },
  {
    slug: "arts-science-showcase-2026",
    title: "Horizon Arts & Science Showcase",
    eventDate: "2026-10-15",
    startTime: "4:30 PM – 7:30 PM",
    location: "The Atrium",
    category: "School community",
  },
];

async function getSchoolData() {
  await db
    .insert(programs)
    .values(learningStageSeed)
    .onConflictDoUpdate({
      target: programs.slug,
      set: {
        title: sql`excluded.title`,
        degree: sql`excluded.degree`,
        description: sql`excluded.description`,
        duration: sql`excluded.duration`,
        icon: sql`excluded.icon`,
        featured: sql`excluded.featured`,
      },
    });

  await db
    .insert(campusEvents)
    .values(schoolEventSeed)
    .onConflictDoUpdate({
      target: campusEvents.slug,
      set: {
        title: sql`excluded.title`,
        eventDate: sql`excluded.event_date`,
        startTime: sql`excluded.start_time`,
        location: sql`excluded.location`,
        category: sql`excluded.category`,
      },
    });

  const [learningStages, eventRows] = await Promise.all([
    db.select().from(programs).orderBy(asc(programs.id)).limit(6),
    db.select().from(campusEvents).orderBy(asc(campusEvents.eventDate)).limit(3),
  ]);

  return {
    programs: learningStages.map((stage) => ({
      id: stage.id,
      slug: stage.slug,
      title: stage.title,
      degree: stage.degree,
      description: stage.description,
      duration: stage.duration,
      icon: stage.icon,
    })),
    events: eventRows.map((event) => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      date: event.eventDate,
      startTime: event.startTime,
      location: event.location,
      category: event.category,
    })),
  };
}

export default async function HomePage() {
  const data = await getSchoolData();
  return <SchoolExperience programs={data.programs} events={data.events} />;
}
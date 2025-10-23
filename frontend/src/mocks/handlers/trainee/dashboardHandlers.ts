import { delay, http, HttpResponse } from "msw";

const userProfile = {
  firstName: "Name",
  projectId: 21231,
  batchId: 12345,
};

const projectData = {
  id: 21231,
  title: "ILP Repo",
  status: "Live",
  technologies: [".NET", "React"],
  team: {
    number: 4,
    members: [
      "Dhanush Kovi",
      "Nino Jagadish",
      "Raihana Rasaldeen",
      "Merlin Baiju",
      "Nandhu Krishna",
      "Mohammed Aiman",
      "Alex Joseph Pius",
    ],
  },
  progress: 60,
};

const batchData = {
  id: 12345,
  title: "ILP 2025-26 Batch 1",
  type: "Associate Software Developer Training",
  startDate: "2025-08-04T00:00:00.000Z",
  endDate: "2025-12-09T00:00:00.000Z",
  day: 23,
  status: "Ongoing",
};

const allDocuments = [
  {
    id: 1,
    title: "JS Module Test File",
    uploadDate: "2025-08-12T11:11:11.000Z",
    type: "xlsx",
    url: "https://example.com/",
  },
  {
    id: 2,
    title: "BRD Template",
    uploadDate: "2024-02-01T12:11:11.000Z",
    type: "pdf",
    url: "https://github.com/",
  },
  {
    id: 3,
    title: "Sprint Tracker 424242422222222222222 214115r2r 1 3251r",
    uploadDate: "2024-02-01T12:11:11.000Z",
    type: "docx",
    url: "https://github.com/",
  },
  {
    id: 4,
    title: "BRD Template (Old Version)",
    uploadDate: "2024-02-01T12:11:11.000Z",
    type: "xls",
    url: "https://github.com/",
  },
];

const batchSessions = [
  {
    id: 1,
    title: ".NET Fundamentals",
    category: ".NET",
    date: "2023-09-10T11:11:11.000Z",
  },
  {
    id: 2,
    title: "React Hooks",
    category: "React",
    date: "2025-06-03T09:07:02.000Z",
  },
  {
    id: 3,
    title: "React epogQo{egvP EWgvPO:wkgvOPWmgpv",
    category: "wINDOWS",
    date: "2025-06-03T09:07:02.000Z",
  },
  {
    id: 4,
    title: "Java Fun",
    category: "iwnfovwqjevpoqvqejmfoqekfpoqejv",
    date: "2025-06-03T09:07:02.000Z",
  },
  {
    id: 5,
    title: "React Hooks",
    category: "React",
    date: "2025-06-03T09:07:02.000Z",
  },
  {
    id: 6,
    title: "React Hooks",
    category: "React",
    date: "2025-06-03T09:07:02.000Z",
  },
];

const userScores = {
  average: 79.75,
  rank: 19,
  courses: [
    { caption: "Tech Fundamentals", value: 78.1 },
    { caption: "Specialization", value: 81.4 },
  ],
};

export const dashboardHandlers = [
  http.get("/api/profile", async () => {
    await delay(200);

    return HttpResponse.json(userProfile);
  }),

  http.get("/api/documents", async () => {
    await delay(1200);

    return HttpResponse.json(allDocuments);
  }),

  http.get("/api/scores", async () => {
    await delay(500);

    return HttpResponse.json(userScores);
  }),

  http.get("/api/project/:projectId", async ({ params }) => {
    const { projectId } = params;
    await delay(2000);

    if (Number(projectId) !== projectData.id) {
      return HttpResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(projectData);
  }),

  http.get("/api/batch/:batchId", async ({ params }) => {
    const { batchId } = params;
    await delay(1500);

    if (Number(batchId) !== batchData.id) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    return HttpResponse.json(batchData);
  }),

  http.get("/api/batch/:batchId/sessions", async ({ params }) => {
    const { batchId } = params;
    await delay(3000);

    if (Number(batchId) !== batchData.id) {
      return HttpResponse.json(
        { message: "Sessions for this batch not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(batchSessions);
  }),
];

export default dashboardHandlers;

const express = require("express");
const prisma = require("../libs/prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await prisma.subject.findMany();
  res.json(subjects);
});

router.post("/", async (req, res) => {
  const { title, prof } = req.body;

  if (!title || !prof) {
    return res.status(400).json({ error: "title and prof are required" });
  }

  try {
    const added_subject = await prisma.subject.create({
      data: { title, prof },
    });
    res.status(201).json(added_subject);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Subject already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/:title", async (req, res) => {
  try {
    const deleted_subject = await prisma.subject.delete({
      where: { title: req.params.title },
    });
    res.json(deleted_subject);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Subject not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:title/summaries", async (req, res) => {
  const summaries = await prisma.summary.findMany({
    where: { subjectTitle: req.params.title },
  });
  res.json(summaries);
});

router.post("/:title/summaries", async (req, res) => {
  const { title, author, fileUrl, fileType } = req.body;

  if (!title || !fileUrl || !["pdf", "image"].includes(fileType)) {
    return res
      .status(400)
      .json({ error: "title, fileUrl and fileType (pdf|image) are required" });
  }

  try {
    const summary = await prisma.summary.create({
      data: {
        title,
        author,
        fileUrl,
        fileType,
        subjectTitle: req.params.title,
      },
    });
    res.status(201).json(summary);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Subject not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/:title/summaries/:id", async (req, res) => {
  const result = await prisma.summary.deleteMany({
    where: { id: Number(req.params.id), subjectTitle: req.params.title },
  });
  if (result.count === 0)
    return res.status(404).json({ error: "Summary not found" });
  res.status(204).send();
});

router.get("/:title", async (req, res) => {
  const subject = await prisma.subject.findUnique({
    where: { title: req.params.title },
  });
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  res.json(subject);
});

module.exports = router;

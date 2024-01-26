const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { query, validationResult, body } = require("express-validator");

// ROUTE: 1 Get all notes using: GET "/api/note/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE: 2 Add a new note using: POST "/api/note/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "Description must be 10 characters").isLength({ min: 10 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Update note using: PUT "/api/note/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    //Create newNote obj
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete note using: DELETE "/api/note/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  try {
    //Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note Found");
    }
    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const buildNotesQueryOptions = require('../utils/buildNotesQuery');
const buildOwnedNoteQuery = require('../utils/noteOwnership');

// Validation Schemas
const noteCreateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived', 'draft']).optional(),
  isPinned: z.boolean().optional(),
});

const noteUpdateSchema = noteCreateSchema.partial();

// Enforce authentication on all note routes
router.use(authMiddleware);

// @route   POST /notes
// @desc    Create a new note (userId from token)
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const parseResult = noteCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors.map(err => err.message)
      });
    }

    const { title, content, category, tags, status, isPinned } = parseResult.data;

    const note = new Note({
      title,
      content,
      category,
      tags,
      status,
      isPinned,
      userId: req.user.id // Taken securely from JWT
    });

    await note.save();

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /notes
// @desc    Get all notes for authenticated user
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const {
      query,
      sortOptions,
      pageNumber,
      limitNumber,
      skipNumber,
    } = buildNotesQueryOptions(req.user.id, req.query);

    const [total, notes] = await Promise.all([
      Note.countDocuments(query),
      Note.find(query)
        .sort(sortOptions)
        .skip(skipNumber)
        .limit(limitNumber)
    ]);

    res.status(200).json({
      success: true,
      data: {
        notes,
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /notes/:id
// @desc    Get specific note detailed info
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOne(buildOwnedNoteQuery(req.user.id, req.params.id));
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        errors: ['No note with this ID belongs to the current user']
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /notes/:id
// @desc    Update an existing note
// @access  Private
router.patch('/:id', async (req, res, next) => {
  try {
    const parseResult = noteUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors.map(err => err.message)
      });
    }

    const note = await Note.findOneAndUpdate(
      buildOwnedNoteQuery(req.user.id, req.params.id),
      { $set: parseResult.data },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        errors: ['Update access failed or note not found']
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /notes/:id
// @desc    Remove a note
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete(buildOwnedNoteQuery(req.user.id, req.params.id));
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
        errors: ['Delete access failed or note not found']
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        message: 'Note deleted successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

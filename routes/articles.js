const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const auth = require('../middlewares/auth');
const Article = require('../models/Article');

const upload = multer({
  dest: '/uploads/temp_uploads/',
  limits: { fileSize: 1 * 1024 * 1024, files: 1 },
}).any();

// @route     GET api/articles
// @desc      Get all articles
// @access    Public
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ created_at: -1 });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/articles
// @desc      Add new article
// @access    Private
router.post('/', auth, async (req, res) => {
  upload(req, res, async (err) => {
    const { title, body, slug } = req.body;

    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: '1mb is max file size' }).end();
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ msg: 'Choose only one file' }).end();
      } else {
        return res.status(400).json({ msg: 'Error uploading file...' }).end();
      }
    }

    try {
      if (!req.files || !title || !slug || !body) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
      }

      const findArticle = await Article.findOne({ slug });

      if (findArticle) {
        return res.status(400).json({
          msg: 'That slug is already in use, please include different one',
        });
      }

      let articleImg;

      const tempPath = req.files[0].path;
      const targetPath = path.join(
        __dirname,
        `../uploads/articles/${req.files[0].originalname}`
      );

      if (req.files[0].mimetype.startsWith('image/')) {
        fs.rename(tempPath, targetPath, (err) => {
          if (err) throw err;
        });
        articleImg = `/uploads/articles/${req.files[0].originalname}`;
      } else {
        fs.unlink(tempPath, (err) => {
          if (err) throw err;
        });
      }

      const newArticle = new Article({
        title,
        slug,
        body,
        image: articleImg,
        author: req.user.name,
      });

      const article = await newArticle.save();

      res.json(article);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
});

// @route     PUT api/articles/:id
// @desc      Update article
// @access    Private
router.put('/:id', (req, res) => {
  res.send('Update Article');
});

// @route     Delete api/articles/:id
// @desc      Delete article
// @access    Private
router.delete('/:id', (req, res) => {
  res.send('Delete Article');
});

module.exports = router;

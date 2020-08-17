const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const auth = require('../middlewares/auth');
const Article = require('../models/Article');
const User = require('../models/User');

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
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route     GET api/articles/:slug
// @desc      Get single article
// @access    Public
router.get('/article/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    const userImg = await User.findOne({ name: article.author });
    const user_img = { userImg: userImg.image };
    res.json([article, user_img]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route     GET api/articles
// @desc      Get all users articles
// @access    Public
router.get('/user', auth, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.name }).sort({
      created_at: -1,
    });
    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
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
      res.status(500).json({ msg: 'Server Error' });
    }
  });
});

// @route     PUT api/articles/:id
// @desc      Update article
// @access    Private
router.put('/:id', auth, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: '1mb is max file size' }).end();
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ msg: 'Choose only one file' }).end();
      } else {
        return res.status(400).json({ msg: 'Error uploading file...' }).end();
      }
    }

    const { title, slug, body } = req.body;
    const image = req.files[0];

    try {
      let article = await Article.findByIdAndUpdate(req.params.id);

      if (!article) {
        return res.status(404).json({ msg: 'Article not found' });
      }

      if (article.author !== req.user.name) {
        return res.status(401).json({ msg: 'Not Authorized' });
      }

      const articleFields = {};
      if (title) articleFields.title = title;
      if (slug) articleFields.slug = slug;
      if (image) {
        fs.unlink(path.join(__dirname, `..${article.image}`), (err) => {
          if (err) throw err;
        });

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

        articleFields.image = articleImg;
      }
      if (body) articleFields.body = body;

      article = await Article.findByIdAndUpdate(
        req.params.id,
        { $set: articleFields },
        { new: true }
      );

      res.json(article);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  });
});

// @route     Delete api/articles/:id
// @desc      Delete article
// @access    Private
router.delete('/:slug', auth, async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });

    if (!article) return res.status(404).json({ msg: 'Article not found' });

    if (article.author !== req.user.name)
      return res.status(401).json({ msg: 'Not authorized' });

    await Article.findOneAndRemove({ slug: req.params.slug });

    fs.unlink(path.join(__dirname, `..${article.image}`), (err) => {
      if (err) throw err;
    });

    res.json({ msg: 'Article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

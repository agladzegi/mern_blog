const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { isName, isEmail, isPassword } = require('../middlewares/validation');

const upload = multer({
  dest: '/uploads/temp_uploads/',
  limits: { fileSize: 1 * 1024 * 1024, files: 1 },
}).any();

const User = require('../models/User');

// @route     POST api/users
// @desc      Register user
// @access    Public
router.post('/', async (req, res) => {
  upload(req, res, async (err) => {
    const { name, email, password } = req.body;
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: '1mb is max file size' }).end();
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ msg: 'Choose only one file' }).end();
      } else {
        return res.status(400).json({ msg: 'Error uploading file...' }).end();
      }
    } else {
      if (!name.match(isName)) {
        return res
          .status(400)
          .json({ msg: 'Please include valid full name' })
          .end();
      } else if (!email.match(isEmail)) {
        return res
          .status(400)
          .json({ msg: 'Please include valid email' })
          .end();
      } else if (!password.match(isPassword)) {
        return res
          .status(400)
          .json({
            msg:
              'Please include password with at least 8 characters, 1 Uppercase letter and 1 number',
          })
          .end();
      } else if (
        req.files[0] !== undefined &&
        path.extname(req.files[0].originalname).toLowerCase() !== '.png'
      ) {
        return res
          .status(400)
          .json({
            msg: 'Only .png files are allowed',
          })
          .end();
      } else {
        try {
          let user = await User.findOne({ email });

          if (user) {
            return res.status(400).json({ msg: 'User already exists' });
          }

          let userImg;

          if (!req.files[0]) {
            userImg = '/uploads/avatars/avatar.png';
          }

          if (req.files[0]) {
            const tempPath = req.files[0].path;
            const targetPath = path.join(
              __dirname,
              `../uploads/avatars/${req.files[0].filename}.png`
            );

            if (
              path.extname(req.files[0].originalname).toLowerCase() === '.png'
            ) {
              fs.rename(tempPath, targetPath, (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ msg: 'Opps, something went wrong' })
                    .end();
              });
              userImg = `/uploads/avatars/${req.files[0].filename}.png`;
            } else {
              fs.unlink(tempPath, (err) => {
                if (err)
                  return res
                    .status(500)
                    .json({ msg: 'Opps, something went wrong' })
                    .end();
              });
            }
          }

          user = new User({
            name,
            email,
            password,
            image: userImg,
          });

          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(password, salt);

          await user.save();

          const payload = {
            user: {
              id: user.id,
              name: user.name,
              image: user.image,
            },
          };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
        }
      }
    }
  });
});

module.exports = router;

const Post = require("../models/post");

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(401).json({ message: "Couldn't update post!" });
    });
};

exports.createPost = (req, res, next) => {
  //console.log(req.file.filename);
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res
      .status(201)
      .json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
          /*
      id: createdPost._id,
      title: createdPost.title,
      content: createdPost.content,
      imagePath: createdPost.imagePath
      */
        },
      })
      .catch((error) => {
        res.status(500).json({
          message: "Creating a post failed!",
        });
      });
  });

  /**
   * qui ci avevo messo la next() ma non ci va
   * in quanto altrimenti proseguirebbe con il
   * middleware successivo e quando quello o un altro
   * cercherà di restituire un valore, ci sarebbe
   * un'errore in quanto il valore è stato già restituito.
   * per tanto il metodo:
   *          next();
   * NON va inserito dopo che si restituisce un valore.
   * in generale, non si mette dopo le post perchè queste
   * sono delle richieste di inserimento solitamente o
   * comunque delle richieste di messaggio alle quali
   * si deve rispondere subito per notificare se
   * la richiesta è stata consegnata con successo o meno.
   */
};

const Poem = require('../models/Poem');
const User = require('../models/User');
exports.getPoems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};
        if (req.query.author) filter.author = req.query.author;
        
        const total = await Poem.countDocuments(filter);
        const poems = await Poem.find(filter)
            .populate('author', 'nickname avatar')
            .populate('comments.author', 'nickname avatar')
            .populate('comments.replies.author', 'nickname avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);
        res.json({ poems, totalPages, currentPage: page, totalCount: total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPoem = async (req, res) => {
    try {
        const { title, content, font } = req.body;
        const poem = await Poem.create({ 
            title, 
            content,
            font: font || 'Arial',
            author: req.user.id 
        });
        res.status(201).json(poem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePoem = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });
        
        if (poem.author && poem.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu şiiri silmeye yetkiniz yok' });
        }
        
        await Poem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Şiir silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePoem = async (req, res) => {
    try {
        const { title, content, font } = req.body;
        const poem = await Poem.findById(req.params.id);
        
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });
        if (poem.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bu şiiri düzenlemeye yetkiniz yok' });
        }
        
        poem.title = title || poem.title;
        poem.content = content || poem.content;
        poem.font = font || poem.font;
        
        await poem.save();
        res.json(poem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const poemId = req.params.id;

        const poem = await Poem.findById(poemId).populate('author', '_id');
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = { text, author: req.user.id };
        poem.comments.push(comment);
        const savedPoem = await poem.save();
        const savedComment = savedPoem.comments[savedPoem.comments.length - 1];
        
        if (poem.author._id.toString() !== req.user.id) {
            await User.findByIdAndUpdate(poem.author._id, {
                $push: {
                    notifications: {
                        type: 'comment',
                        from: req.user.id,
                        poem: poem._id,
                        commentId: savedComment._id,
                        message: `${req.user.nickname} şiirinize yorum yaptı`,
                        read: false
                    }
                }
            });
        }
        
        await poem.populate('comments.author', 'nickname avatar');
        res.status(201).json({ message: 'Yorum eklendi', poem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReply = async (req, res) => {
    try {
        const { text } = req.body;
        const poemId = req.params.poemId;
        const commentId = req.params.commentId;

        const poem = await Poem.findById(poemId).populate('author', '_id').populate('comments.author', '_id');
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = poem.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

        const reply = { text, author: req.user.id };
        comment.replies.push(reply);
        const savedPoem = await poem.save();
        const savedReply = comment.replies[comment.replies.length - 1];

        if (comment.author._id.toString() !== req.user.id) {
            await User.findByIdAndUpdate(comment.author._id, {
                $push: {
                    notifications: {
                        type: 'reply',
                        from: req.user.id,
                        poem: poem._id,
                        commentId: comment._id,
                        message: `${req.user.nickname} yorumunuza yanıt verdi`,
                        read: false
                    }
                }
            });
        }

        if (poem.author._id.toString() !== req.user.id && poem.author._id.toString() !== comment.author._id.toString()) {
            await User.findByIdAndUpdate(poem.author._id, {
                $push: {
                    notifications: {
                        type: 'reply',
                        from: req.user.id,
                        poem: poem._id,
                        commentId: comment._id,
                        message: `${req.user.nickname} şiirinize yanıt verdi`,
                        read: false
                    }
                }
            });
        }

        await savedPoem.populate('comments.author', 'nickname avatar');
        await savedPoem.populate('comments.replies.author', 'nickname avatar');
        res.status(201).json({ message: 'Yanıt eklendi', poem: savedPoem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const poem = await Poem.findById(req.params.poemId);
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = poem.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yorumu düzenlemeye yetkiniz yok' });
        }

        comment.text = text;
        comment.edited = true;
        await poem.save();
        res.json({ message: 'Yorum güncellendi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.poemId);
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = poem.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yorumu silmeye yetkiniz yok' });
        }

        poem.comments.pull(req.params.commentId);
        await poem.save();
        res.json({ message: 'Yorum silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateReply = async (req, res) => {
    try {
        const { text } = req.body;
        const poem = await Poem.findById(req.params.poemId);
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = poem.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

        const reply = comment.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: 'Yanıt bulunamadı' });

        if (reply.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yanıtı düzenlemeye yetkiniz yok' });
        }

        reply.text = text;
        reply.edited = true;
        await poem.save();
        res.json({ message: 'Yanıt güncellendi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.poemId);
        if (!poem) return res.status(404).json({ message: 'Şiir bulunamadı' });

        const comment = poem.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Yorum bulunamadı' });

        const reply = comment.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: 'Yanıt bulunamadı' });

        if (reply.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yanıtı silmeye yetkiniz yok' });
        }

        comment.replies.pull(req.params.replyId);
        await poem.save();
        res.json({ message: 'Yanıt silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserComments = async (req, res) => {
    try {
        const userId = req.params.userId;
        const poems = await Poem.find({
            $or: [
                { 'comments.author': userId },
                { 'comments.replies.author': userId }
            ]
        }).select('title comments').populate('comments.author', 'nickname avatar').populate('comments.replies.author', 'nickname avatar');

        let userComments = [];
        poems.forEach(poem => {
            poem.comments.forEach(comment => {
                if (comment.author._id.toString() === userId) {
                    userComments.push({
                        _id: comment._id,
                        poemId: poem._id,
                        poemTitle: poem.title,
                        text: comment.text,
                        createdAt: comment.createdAt,
                        type: 'comment',
                        edited: comment.edited
                    });
                }
                comment.replies.forEach(reply => {
                    if (reply.author._id.toString() === userId) {
                        userComments.push({
                            _id: reply._id,
                            poemId: poem._id,
                            poemTitle: poem.title,
                            parentCommentText: comment.text,
                            text: reply.text,
                            createdAt: reply.createdAt,
                            type: 'reply',
                            edited: reply.edited
                        });
                    }
                });
            });
        });

        userComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(userComments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
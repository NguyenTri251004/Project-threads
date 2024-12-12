const controller = {};
const models = require("../models");
const { Op } = require("sequelize");

//load search  
controller.loadSearch = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({ message: "Bạn cần đăng nhập" });
        }

        const users = await models.User.findAll({
            where: { id: { [models.Sequelize.Op.ne]: userId } }
        });

        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            attributes: ['followed_id']
        });
        const followingIds = following.map(f => f.followed_id);
        const userList = users.map(user => ({
            id: user.id,
            name: user.username,
            subname: user.subname,
            ava: user.profile_picture || '/assets/image/pic1.jpg', 
            isFollowing: followingIds.includes(user.id) 
        }));
        res.render('search', { userList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống! " });
    }
}
//load Home
controller.loadHome = async (req , res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({ message: "Bạn cần đăng nhập" });
        }

        const threads = await models.Thread.findAll({
            where: {
                user_id: { [Op.ne]: userId }
            },
            attributes: [
                'id', 
                'content', 
                'image_url' , 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.col('likes-threads.id')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.col('comments-threads.thread_id')), 'totalComments'],
            ],
            include : [
                {
                    model: models.User,
                    as: 'users-threads', 
                    attributes: ['id', 'username', 'profile_picture'], 
                },
                {
                    model: models.Like,
                    as: 'likes-threads', 
                    attributes: [],
                },
                {
                    model: models.Comment,
                    as: 'comments-threads', 
                    attributes: [],
                }
            ],
            group: ['Thread.id', 'users-threads.id'],
            order: [['created_at', 'DESC']]
        })
        const inforUserId = await models.User.findOne({
            where: {
                id : userId,
            }
        })
        const formattedThreads = threads.map(thread => ({
            threadId: thread.id,
            userId: thread['users-threads'].id,
            username: thread['users-threads'].username,
            ava: thread['users-threads'].profile_picture,
            content: thread.content,
            img: thread.image_url,
            created_at: thread.created_at,
            totalLikes: thread.dataValues.totalLikes,
            totalComments: thread.dataValues.totalComments,
        }));
        res.render('home', { formattedThreads, inforUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
}
//load Home Follwing
controller.loadHomeFollowing = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(400).json({ message: "Bạn cần đăng nhập" });
        }

        const inforUserId = await models.User.findOne({
            where: {
                id : userId,
            }
        })

        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            attributes: ['followed_id']
        });

        const followingUserIds = following.map(follow => follow.followed_id);

        if (followingUserIds.length === 0) {
            return res.render('home', { formattedThreads: [], inforUserId});
        }

        const threads = await models.Thread.findAll({
            where: {
                user_id: { [Op.in]: followingUserIds }
            },
            attributes: [
                'id', 
                'content', 
                'image_url' , 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.col('likes-threads.id')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.col('comments-threads.thread_id')), 'totalComments'],
            ],
            include : [
                {
                    model: models.User,
                    as: 'users-threads', 
                    attributes: ['id', 'username', 'profile_picture'], 
                },
                {
                    model: models.Like,
                    as: 'likes-threads', 
                    attributes: [],
                },
                {
                    model: models.Comment,
                    as: 'comments-threads', 
                    attributes: [],
                }
            ],
            group: ['Thread.id', 'users-threads.id'],
            order: [['created_at', 'DESC']]
        })
        
        const formattedThreads = threads.map(thread => ({
            threadId: thread.id,
            userId: thread['users-threads'].id,
            username: thread['users-threads'].username,
            ava: thread['users-threads'].profile_picture,
            content: thread.content,
            img: thread.image_url,
            created_at: thread.created_at,
            totalLikes: thread.dataValues.totalLikes,
            totalComments: thread.dataValues.totalComments,
        }));
        res.render('home', { formattedThreads, inforUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
}
//load details
controller.loadThreadDetails = async (req, res) => {
    const threadId = req.params.id_thread;
    if (!threadId) {
        return res.status(400).render('error', { message: "Thread ID không hợp lệ" });
    }
    try {
        const threadDetails = await models.Thread.findOne( {
            where: { id: threadId },
            attributes: [
                'id', 
                'content', 
                'image_url' , 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.col('likes-threads.id')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.col('comments-threads.thread_id')), 'totalComments'],
            ],
            include : [
                {
                    model: models.User,
                    as: 'users-threads', 
                    attributes: ['id', 'username', 'profile_picture'], 
                },
                {
                    model: models.Like,
                    as: 'likes-threads', 
                    attributes: [],
                },
                {
                    model: models.Comment,
                    as: 'comments-threads', 
                    attributes: [],
                }
            ],
            group: ['Thread.id', 'users-threads.id'],
        });

        if (!threadDetails) {
            return res.status(404).render('404', { message: 'Bài đăng không tồn tại' });
        }

        const comments = await models.Comment.findAll({
            where: { thread_id: threadId },
            attributes: ['id', 'content', 'created_at'],
            include: [
                {
                    model: models.User,
                    as: 'users-comments',
                    attributes: ['id', 'username', 'profile_picture'],
                },
            ],
            order: [['created_at', 'DESC']], // Sắp xếp theo thời gian
        });



        res.render('details', {
            threadId: threadDetails.id,
            userId: threadDetails['users-threads'].id,
            username: threadDetails['users-threads'].username,
            ava: threadDetails['users-threads'].profile_picture,
            content: threadDetails.content,
            img: threadDetails.image_url,
            created_at: threadDetails.created_at,
            totalLikes: threadDetails.dataValues.totalLikes,
            totalComments: threadDetails.dataValues.totalComments,
            comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Lỗi server' });
    }
}
module.exports = controller;
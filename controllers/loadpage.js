const controller = {};
const models = require("../models");
const { Op } = require("sequelize");

//load search  
controller.loadSearch = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const user = await models.User.findByPk(userId);
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
        res.render('search', { userList,user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi hệ thống! " });
    }
}
//load Home
controller.loadHome = async (req , res) => {
    try {
        const userId = req.cookies.userId;
        const threads = await models.Thread.findAll({
            where: {
                user_id: { [Op.ne]: userId }
            },
            attributes: [
                'id', 
                'content', 
                'image_url' , 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "likes-threads"."id"')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "comments-threads"."id"')), 'totalComments']
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
        const formattedThreads = await Promise.all(threads.map(async (thread) => {
            const isLiked = await models.Like.findOne({
                where: {
                    thread_id: thread.id,
                    user_id: userId,
                },
            });

            return {
                threadId: thread.id,
                userId: thread['users-threads'].id,
                username: thread['users-threads'].username,
                ava: thread['users-threads'].profile_picture,
                content: thread.content,
                img: thread.image_url,
                created_at: thread.created_at,
                totalLikes: thread.dataValues.totalLikes,
                totalComments: thread.dataValues.totalComments,
                isLiked: !!isLiked, 
            };
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
        const inforUserId = await models.User.findOne({
            where: {
                id: userId,
            }
        });

        const following = await models.Follow.findAll({
            where: { follower_id: userId },
            attributes: ['followed_id']
        });

        const followingUserIds = following.map(follow => follow.followed_id);

        if (followingUserIds.length === 0) {
            return res.render('home', { formattedThreads: [], inforUserId });
        }

        const threads = await models.Thread.findAll({
            where: {
                user_id: { [Op.in]: followingUserIds }
            },
            attributes: [
                'id', 
                'content', 
                'image_url', 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "likes-threads"."id"')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "comments-threads"."id"')), 'totalComments']
            ],
            include: [
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
        });

        const formattedThreads = await Promise.all(threads.map(async (thread) => {
            const isLiked = await models.Like.findOne({
                where: {
                    thread_id: thread.id,
                    user_id: userId,
                },
            });

            return {
                threadId: thread.id,
                userId: thread['users-threads'].id,
                username: thread['users-threads'].username,
                ava: thread['users-threads'].profile_picture,
                content: thread.content,
                img: thread.image_url,
                created_at: thread.created_at,
                totalLikes: thread.dataValues.totalLikes,
                totalComments: thread.dataValues.totalComments,
                isLiked: !!isLiked,  
            };
        }));

        res.render('home', { formattedThreads, inforUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
//load details
controller.loadThreadDetails = async (req, res) => {
    const threadId = req.params.id_thread;
    const userId = req.cookies.userId;
    if (!threadId) {
        return res.status(400).render('error', { message: "Thread không hợp lệ" });
    }
    try {
        const threadDetails = await models.Thread.findOne( {
            where: { id: threadId },
            attributes: [
                'id', 
                'content', 
                'image_url' , 
                'created_at',
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "likes-threads"."id"')), 'totalLikes'],
                [models.Sequelize.fn('COUNT', models.Sequelize.literal('DISTINCT "comments-threads"."id"')), 'totalComments']
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
            order: [['created_at', 'DESC']], 
        });
        const isLiked = await models.Like.findOne({
            where: {
                thread_id: threadId,
                user_id: userId,
            },
        });
        const currentUser = await models.User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'profile_picture'],
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
            isLiked: !!isLiked,
            comments,
            currentUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Lỗi server' });
    }
}
//load view profile
controller.viewProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await models.User.findOne({ where: { username: username } });
        if (!user) {
            return res.redirect('/'); 
        }

        const threads = await models.Thread.findAll({
            where: { user_id: user.id },
            include: [
                { model: models.Like, as: 'likes-threads' },
                { model: models.Comment, as: 'comments-threads' },
                { model: models.User, as: 'users-threads', attributes: ['username', 'profile_picture'] } 
            ],
            order: [['created_at', 'DESC']],
        });
        
        const userId = parseInt(req.cookies.userId);

         const formattedThreads = await Promise.all(
            threads.map(async (thread) => {
                const isLiked = await models.Like.findOne({
                    where: { thread_id: thread.id, user_id: userId },
                });

                return {
                    ...thread.toJSON(),
                    totalLikes: thread['likes-threads'].length,
                    totalComments: thread['comments-threads'].length,
                    username: thread['users-threads'].username,
                    profile_picture: thread['users-threads'].profile_picture,
                    isLiked: !!isLiked, 
                };
            })
        );
        
        const followers = await models.Follow.findAll({ where: { followed_id: user.id } });
        const isFollowing = followers.some(f => f.follower_id === parseInt(req.cookies.userId));
        res.render('follow', {
            user: user,
            threads: formattedThreads,
            totalFollowers: followers.length,
            isFollowing: isFollowing,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        res.redirect('/'); 
    }
}
//load activity
controller.loadActivity = async (req, res) => {
    try {
        const currentUserId = req.cookies.userId;
        const user = await models.User.findByPk(currentUserId);
        const notifications = await models.Notification.findAll({
            where: { user_id: currentUserId },
            include: [
                {
                    model: models.User,
                    attributes: ["username", "profile_picture"], 
                },
            ],
            order: [["created_at", "DESC"]], 
        });

        await models.Notification.update(
            { is_read: true }, // Cập nhật trạng thái 'is_read'
            { where: { user_id: currentUserId } } // Áp dụng cho các thông báo của người dùng hiện tại
        );


        const formattedNotifications = notifications.map((notification) => ({
            id: notification.id,
            type: notification.type,
            content: notification.content,
            isRead: notification.is_read,
            createdAt: notification.created_at,
            username: notification.User ? notification.User.username : null,
            profilePicture: notification.User ? notification.User.profile_picture : null,
        }));
        res.cookie('is_read', 'true', { maxAge: 3600000, httpOnly: false }); 
        res.render("activity", { notifications: formattedNotifications, user });
    } catch (error) {
        console.error("Lỗi không load được activity:", error);
        res.status(500).json({ message: "Lỗi server." });
    }
}
module.exports = controller;
/**
 * Seed script — creates the admin account and optional demo content.
 * Run with:  npm run seed
 *
 * The admin credentials come from the environment variables
 * ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD (see .env.example).
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const BlogPost = require('./models/BlogPost');

const seed = async () => {
  try {
    await connectDB();

    // 1. Admin user
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping admin creation.');
    } else {
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        name: 'Administrator',
        isAdmin: true,
      });
      console.log(`Admin created: ${adminUsername} / ${adminEmail}`);
    }

    // 2. Demo skills (only if the collection is empty)
    if ((await Skill.countDocuments()) === 0) {
      const demoSkills = [
        { name: 'JavaScript', category: 'Languages', level: 85 },
        { name: 'Node.js', category: 'Back-End', level: 80 },
        { name: 'Express', category: 'Back-End', level: 78 },
        { name: 'React', category: 'Front-End', level: 82 },
        { name: 'MongoDB', category: 'Databases', level: 75 },
        { name: 'MySQL', category: 'Databases', level: 72 },
        { name: 'Git & GitHub', category: 'Tools', level: 80 },
        { name: 'HTML & CSS', category: 'Front-End', level: 88 },
      ];
      await Skill.insertMany(demoSkills);
      console.log(`Seeded ${demoSkills.length} demo skills.`);
    } else {
      console.log('Skills collection is not empty, skipping demo skills.');
    }

    // 3. Demo projects (only if the collection is empty)
    if ((await Project.countDocuments()) === 0) {
      const demoProjects = [
        {
          title: 'Full-Stack Portfolio & Blog',
          description:
            'A production-ready personal portfolio website with a React single-page application and a Node.js/Express RESTful API backed by MongoDB Atlas. Includes user authentication, a full-featured blog with comments, and an admin dashboard.',
          link: '',
          github: '',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
          featured: true,
        },
        {
          title: 'Student Database Management',
          description:
            'A coursework project managing student, course and enrollment records with complex SQL queries (joins, grouping, sub-queries) executed through Navicat for MySQL.',
          link: '',
          github: '',
          technologies: ['MySQL', 'SQL', 'Navicat'],
          featured: false,
        },
      ];
      await Project.insertMany(demoProjects);
      console.log(`Seeded ${demoProjects.length} demo projects.`);
    } else {
      console.log('Projects collection is not empty, skipping demo projects.');
    }

    // 4. Demo blog posts (only if the collection is empty)
    if ((await BlogPost.countDocuments()) === 0) {
      const demoPosts = [
        {
          title: 'My Journey Learning Full-Stack Development',
          excerpt:
            'A short reflection on building RESTful APIs with Node.js/Express and consuming them from a React single-page application.',
          content:
            'This semester I have been learning full-stack web development. The most important lesson was understanding how the front-end and back-end communicate through a REST API.\n\nOn the back-end I built Express routes, Mongoose models and JWT-based authentication. On the front-end I used React Router for navigation, Context API for global state, and axios for API calls.\n\nDeploying the back-end to Render and the front-end to Vercel taught me how to configure environment variables and CORS correctly. The whole experience has been incredibly rewarding.',
          tags: ['Full-Stack', 'Learning', 'React'],
          author: 'Dong Mingyan',
          published: true,
        },
      ];
      await BlogPost.insertMany(demoPosts);
      console.log(`Seeded ${demoPosts.length} demo blog post.`);
    } else {
      console.log('Posts collection is not empty, skipping demo posts.');
    }

    console.log('Seeding finished.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();

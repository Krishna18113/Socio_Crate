import express from 'express';
import { PrismaClient } from '@prisma/client'; // Keep this if you're directly querying Prisma in this file for GET
import { protect } from '../middleware/authMiddleware'; // Import your authentication middleware
import { deleteProfilePic } from '../controllers/userController'; // <--- NEW: Import the delete function from the new file

const router = express.Router();
const prisma = new PrismaClient(); // Keep this line as you're using it below
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profilePic: true, // <--- MAKE SURE THIS LINE IS PRESENT AND UNCOMMENTED
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/profile-pic', protect, deleteProfilePic);

export default router;












// import express from 'express';
// import { PrismaClient } from '@prisma/client';

// const router = express.Router();
// const prisma = new PrismaClient();

// // GET /api/users/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         bio: true,
//         profilePic: true, 
//       },
//     });

//     if (!user){res.status(404).json({ message: 'User not found' });return;};

//     res.json(user);
//   } catch (err) {
//     console.error('Failed to fetch user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Review from '@/models/Review';

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.id;

    // Delete all user's reviews
    await Review.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    return Response.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return Response.json({ 
      error: 'Failed to delete account' 
    }, { status: 500 });
  }
}

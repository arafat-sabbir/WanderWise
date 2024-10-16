export interface TUser {
    _id: string;
    email: string;
    password: string;
    name: string;
    profilePicture?: string; // URL to the profile picture
    bio?: string; // Short biography
    isVerified: boolean; // If the user is verified
    followers: string[]; // List of User IDs that follow this user
    following: string[]; // List of User IDs that this user follows
    role: string;
  }
  
  
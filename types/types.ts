export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "text_area",
  PHONE_INPUT = "phone_input",
  SELECT = "select",
}

type TUser = {
  _id: string;
  email: string;
  password: string;
  name: string;
  profilePicture: string;
  bio: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  role: string;
  createdAt: string;
  updatedAt: string;
};

type TComment = {
  _id: string;
  user: TUser;
  comment: string;
  post: string;
  __v: number;
};

export type TPost = {
  _id: string;
  title: string;
  images: string[];
  content: string;
  category: string;
  downvotes: string[];
  upvotes: string[];
  isPremium: boolean;
  user: TUser;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  comments: TComment[];
};

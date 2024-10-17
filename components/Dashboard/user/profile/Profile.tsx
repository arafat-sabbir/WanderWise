"use client"
import { Input } from "@/components/ui/input";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {  useAppSelector } from "@/redux/features/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import { Loader } from "lucide-react";
import { TUser } from "@/types/user/user";

interface ProfileFormValues {
  name: string;
  profilePicture: File | null;
  bio: string;
}

const Profile = ({user,isLoading,refetch}: {user: TUser,isLoading:boolean,refetch:()=>void}) => {
  const token = useAppSelector(selectCurrentToken);

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setProfilePicture(acceptedFiles[0]);
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        bio: user?.bio || "",
      });
    }
  }, [user, reset]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    const userData = new FormData();
    if (profilePicture) {
      userData.append("profilePicture", profilePicture);
    }

    Object.entries(values).forEach(([key, value]) => {
      userData.append(key, value as string);
    });
    
    try {
      const response = await updateUser({ token, userData });
      if (response?.error) {
        return toast.error(response?.error?.data.data?.message);
      }
      refetch();
      toast.success(response?.data?.message);
      setIsEditing(false);
    } catch (error) {
      console.log("Update Error:", error);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader className="w-10 h-10 mx-auto animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-14 py-6 bg-white shadow-2xl mt-16 rounded-lg">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <Image
          height={120}
          width={120}
          src={
            profilePicture
              ? URL.createObjectURL(profilePicture)
              : user?.profilePicture || "/default-avatar.png"
          }
          alt="Profile Picture"
          className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
        />
        {isEditing && (
          <div
            {...getRootProps()}
            className="border-dashed border-2 cursor-pointer border-gray-400 p-4 rounded-lg text-center"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop a new profile picture, or click to select one</p>
            )}
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
      
      {/* Followers and Following Count */}
      <div className="flex justify-center space-x-8 mb-6">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{user?.followers.length || 0}</span>
          <span className="text-sm text-gray-600">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{user?.following?.length || 0}</span>
          <span className="text-sm text-gray-600">Following</span>
        </div>
      </div>

      <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-600">Name</label>
          <Input
            type="text"
            {...register("name", { required: "Name is required" })}
            disabled={!isEditing}
            className={`p-3 border rounded-lg ${
              isEditing ? "border-blue-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        {/* Email (non-editable) */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-600">Email</label>
          <Input
            type="email"
            defaultValue={user?.email || ""}
            disabled
            className="p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-600">Bio</label>
          <textarea
            {...register("bio", { required: "Bio is required" })}
            disabled={!isEditing}
            rows={4}
            className={`p-3 border rounded-lg ${
              isEditing ? "border-blue-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.bio && (
            <span className="text-red-500">{errors.bio.message}</span>
          )}
        </div>

        {/* User Since */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-600">User Since</label>
          <Input
            type="text"
            defaultValue={new Date(user?.createdAt).toLocaleDateString()}
            disabled
            className="p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Edit Button */}
        {isEditing ? (
          <Button type="submit" disabled={isLoading}>
            {updateLoading ? (
              <>
                Saving <Loader className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </Button>
        ) : (
          <div
            onClick={handleEditClick}
            className="py-2 px-6 mt-4 text-center bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
          >
            Edit
          </div>
        )}
      </form>
    </section>
  );
};

export default Profile;

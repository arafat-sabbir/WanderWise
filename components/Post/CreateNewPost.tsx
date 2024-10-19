import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TagsInput } from "react-tag-input-component";
import Image from "next/image";
import { useCreateNewPostMutation } from "@/redux/features/posts/postApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/features/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { Loader } from "lucide-react";
import { Switch } from "../ui/switch"; // Make sure this is the correct path to your Switch component

// Zod validation schema
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  content: z.string().min(1, "Content is required"),
  isPremium: z.boolean().default(false), // Add isPremium field
});

type PostFormValues = z.infer<typeof postSchema>;

const CreateNewPost = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      category: "",
      tags: [],
      images: [],
      content: "",
      isPremium: false, // Default value for isPremium
    },
  });

  const token = useAppSelector(selectCurrentToken);
  const [modelOpen, setModelOpen] = useState(false);
  const [createNewPost, { isLoading }] = useCreateNewPostMutation();

  const onSubmit = async (values: PostFormValues) => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    tags.forEach((tag) => formData.append("tags", tag));
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "tags") {
        formData.append(key, value as string | Blob);
      }
    });
    try {
      const response = await createNewPost({ token, postData: formData });
      if (response?.error) {
        toast.error((response?.error as any)?.data?.message);
      } else {
        toast.success(response?.data?.message);
        setModelOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newImages = [...images, ...acceptedFiles];
      setImages(newImages);
      setValue("images", newImages);
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    },
    multiple: true,
    accept: {
      "image/*": [],
    },
  });

  // Remove image by index
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setValue("images", newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  return (
    <Dialog onOpenChange={setModelOpen} open={modelOpen}>
      <DialogTrigger>
        <Button>Create New Post</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[200vh]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue="">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adventure Travel">
                      Adventure Travel
                    </SelectItem>
                    <SelectItem value="Cultural Experiences">
                      Cultural Experiences
                    </SelectItem>
                    <SelectItem value="Family Travel">Family Travel</SelectItem>
                    <SelectItem value="Budget Travel">Budget Travel</SelectItem>
                    <SelectItem value="Luxury Travel">Luxury Travel</SelectItem>
                    <SelectItem value="Solo Travel">Solo Travel</SelectItem>
                    <SelectItem value="Food and Culinary Tours">
                      Food and Culinary Tours
                    </SelectItem>
                    <SelectItem value="Eco-Tourism">Eco-Tourism</SelectItem>
                    <SelectItem value="Wellness and Retreats">
                      Wellness and Retreats
                    </SelectItem>
                    <SelectItem value="Destination Guides">
                      Destination Guides
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TagsInput
                  value={tags}
                  onChange={(newTags) => {
                    setTags(newTags);
                    field.onChange(newTags);
                  }}
                  name="tags"
                  placeHolder="Enter tags"
                />
              )}
            />
            {errors.tags && (
              <p className="text-red-600">{errors.tags.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <Label htmlFor="images">Images</Label>
            <div {...getRootProps({ className: "border border-dashed p-4" })}>
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select files</p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      height={100}
                      width={100}
                      src={preview}
                      alt={`Preview ${idx}`}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && (
              <p className="text-red-600">{errors.images.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  onChange={(_, editor) => {
                    field.onChange(editor.getData());
                  }}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "blockQuote",
                    ],
                  }}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* isPremium Toggle */}
          <div>
            <Label htmlFor="Premium">Premium</Label>
            <Controller
              control={control}
              name="isPremium"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="Premium"
                    checked={field.value} // This should remain boolean
                    onCheckedChange={(checked) => {
                      field.onChange(checked); // Use the checked boolean directly
                    }}
                  />
                  <span>{field.value ? "Yes" : "No"}</span>
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            Submit{isLoading && <Loader className="ml-2 animate-spin" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewPost;

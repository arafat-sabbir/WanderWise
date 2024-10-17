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

// Zod validation schema
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  content: z.string().min(1, "Content is required"),
});

type PostFormValues = z.infer<typeof postSchema>;

const CreateNewPost = () => {
  const [tags, setTags] = useState<string[]>([]); // Change tag type to string[]
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Image preview state

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
    },
  });
  const token = useAppSelector(selectCurrentToken);

  const [createNewPost, { isLoading }] = useCreateNewPostMutation();
  const onSubmit = async (values: PostFormValues) => {
    const formData = new FormData();
    // Append images to formData
    images.forEach((image) => formData.append("images", image)); // Use `image` instead of `images`
    tags.forEach((tag) => formData.append("tags", tag));
    // Append each key-value pair from `values` to the formData
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "tags") {
        formData.append(key, value as string); // Type casting value to string
      }
    });

    try {
      const response = await createNewPost({ token, postData: formData });
      console.log(response?.data?.data);
      if (response?.error) {
        // toast.error(response?.error?.data?.message);
        // console.log(response?.error?.data);
      }
      //   toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  // React Dropzone for image uploads and preview
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImages(acceptedFiles);
      setValue("images", acceptedFiles);

      // Generate previews
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create New Post</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>

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
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="business-travel">
                      Business Travel
                    </SelectItem>
                    <SelectItem value="exploration">Exploration</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-600">{errors.category.message}</p>
            )}
          </div>

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
                    field.onChange(newTags); // Sync with form state
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

          <div>
            <Label htmlFor="images">Images</Label>
            <div {...getRootProps({ className: "border border-dashed p-4" })}>
              <input {...getInputProps()} />
              <p>Drag & drop some images here, or click to select files</p>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((preview, idx) => (
                  <Image
                    height={100}
                    width={100}
                    key={idx}
                    src={preview}
                    alt={`Preview ${idx}`}
                    className="h-24 w-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
            {errors.images && (
              <p className="text-red-600">{errors.images.message}</p>
            )}
          </div>

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
                  style={{ height: "300px" }} // Increase CKEditor height
                />
              )}
            />
            {errors.content && (
              <p className="text-red-600">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewPost;

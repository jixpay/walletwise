"use client";
import { upload_user_image } from "@/redux/reducers/auth_slice";
import { error, success } from "@/redux/reducers/notification_slice";
import { upload_store_image } from "@/redux/reducers/store_slice";
import { AppDispatch } from "@/redux/store";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";

interface CustomFileInputProps {
  title: string;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomFileInput({
  title,
  image,
  setImage,
  setLoading,
}: CustomFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e: any) => {
          setLoading(true);
          dispatch(upload_user_image(e.target.files[0])).then((res: any) => {
            if (res.error) {
              dispatch(error(res.error.message));
            } else {
              dispatch(success("Image is Ready"));
              setImage(res.payload);
            }
            setLoading(false);
          });
        }}
      />

      {image ? (
        <div className="flex flex-col w-full">
          <div className="w-full bg-green-200 p-2 border border-color1 border-dashed rounded-lg">
            <h1 className="w-full text-center">IMAGE IS READY FOR UPLOAD</h1>
          </div>
          <button className="underline" onClick={handleFileButtonClick}>
            change
          </button>
        </div>
      ) : (
        <div
          className="flex w-full p-2 justify-start items-center border border-color1 border-dashed rounded-lg cursor-pointer"
          onClick={handleFileButtonClick}
        >
          <h1 className="w-full text-center">{title}</h1>
        </div>
      )}
    </div>
  );
}

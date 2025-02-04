"use client";
import { error, success } from "@/redux/reducers/notification_slice";
import { create_store, upload_store_image } from "@/redux/reducers/store_slice";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomFileInput from "../CustomFileInput";

interface CreateStoreModalProps {
  setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateStoreModal({
  setShowCreateModal,
}: CreateStoreModalProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const { loading_create } = useSelector((state: RootState) => state.store);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const Loader = () => {
    return (
      <div className="bg-black opacity-75 w-full h-full absolute inset-0 flex flex-col text-white justify-center items-center">
        <Image src={"/icons/loading.svg"} alt="" width={70} height={70} />
        <h1>Please wait</h1>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="h-screen w-full flex justify-center items-center">
        <div className="border p-2 w-full sm:w-3/4 md:w-1/2 lg:w-1/4 bg-white drop-shadow-lg space-y-2 relative overflow-hidden">
          {(loading_create || loading) && <Loader />}
          <div className="bg-gray-400 h-[75px] text-white flex justify-center items-center text-2xl"></div>
          <div className="border-b border-black">
            <input
              type="text"
              placeholder="store name.."
              className="focus:outline-none p-2"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="border-b border-black">
            <textarea
              placeholder="store description.."
              className="w-full focus:outline-none p-2"
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <CustomFileInput
            title="ADD STORE IMAGE"
            image={image}
            setImage={setImage}
            setLoading={setLoading}
          />
          <div className="py-[1rem]">
            <button
              className="bg-gray-500 text-white text-xl w-full py-1"
              onClick={() => {
                dispatch(create_store({ name, description, image })).then(
                  (res: any) => {
                    if (res.error) {
                      dispatch(error(res.error.message));
                    } else {
                      dispatch(success("store created!"));
                      setShowCreateModal(false);
                    }
                  }
                );
              }}
            >
              CREATE STORE
            </button>
            <button
              className="underline w-full text-center"
              onClick={() => setShowCreateModal(false)}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

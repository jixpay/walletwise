"use client";
import CustomFileInput from "@/components/CustomFileInput";
import { signup, upload_user_image } from "@/redux/reducers/auth_slice";
import { error, success } from "@/redux/reducers/notification_slice";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function Signup() {
  const router = useRouter();

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const Loader = () => {
    return (
      <div className="bg-black opacity-75 w-full h-full absolute inset-0 flex flex-col text-white justify-center items-center">
        <Image src={"/icons/loading.svg"} alt="" width={70} height={70} />
        <h1>Please wait</h1>
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="border p-2 w-full sm:w-3/4 md:w-1/2 lg:w-1/4 bg-white drop-shadow-lg space-y-2 relative overflow-hidden">
        <div className="bg-gray-400 h-[75px] text-white flex justify-center items-center text-2xl"></div>
        <div className="border-b border-black">
          <input
            type="text"
            placeholder="first name.."
            className="focus:outline-none p-2"
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div className="border-b border-black">
          <input
            type="text"
            placeholder="last name.."
            className="focus:outline-none p-2"
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="border-b border-black">
          <input
            type="text"
            placeholder="username.."
            className="focus:outline-none p-2"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="border-b border-black">
          <input
            type="password"
            placeholder="password.."
            className="focus:outline-none p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <CustomFileInput
          title="ADD PROFILE IMAGE"
          image={image}
          setImage={setImage}
          setLoading={setLoading}
        />

        <div className="py-[1rem]">
          <button
            className="bg-gray-500 text-white text-xl w-full py-1"
            onClick={() => {
              setLoading(true);
              dispatch(
                signup({ fname, lname, username, password, image })
              ).then((res: any) => {
                if (res.error) {
                  dispatch(error(res.error.message));
                } else {
                  dispatch(success("Account has been Created"));
                  router.push("/authentication/signin");
                }
                setLoading(false);
              });
            }}
          >
            SIGNUP
          </button>
          <button
            className="underline w-full text-center"
            onClick={() => router.push("/authentication/signin")}
          >
            already have an account
          </button>
        </div>
        {loading && <Loader />}
      </div>
    </div>
  );
}

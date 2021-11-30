import React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../firebase/authUserContext';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


// components layout for page

import Admin from "layouts/Admin.js";
import Firebase from "../../firebase/clientApp";

const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(5),
});

export default function Students() {
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [toggle, setToggle] = useState(true);
    const { authUser, loading, userDoc, teacherStudentDoc, setStudentsDocAsTeacher } = useAuth();
    const toggleClass = ' transform translate-x-5';
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError} = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();
    const db = Firebase.firestore();

    // Listen for changes on loading and authUser, redirect if needed
    useEffect(() => {
      console.log(userDoc);
      console.log("authUser: "+ authUser);
    //   if(userDoc){
    //       console.log("authUser string: " + userDoc.toString());
    //   }
      async function fetchStudents() {
        let x = []
        for(var i = 0; i < userDoc.studentUid.length; i++){
            var docRef = db.collection("students").doc(userDoc.studentUid[i]);
            docRef.get().then((doc) => {
                console.log("Cached document data:", doc.data());
                x.push(doc.data());
            }).catch((error) => {
                console.log(error);
            });
        }
        setStudentsDocAsTeacher(x);
        // let response = await fetch(" http://localhost:3000/api/teacher/student");
        // response = await response.json();
        // console.log(response);
        //dataSet(response)
      }
      if (!loading && !authUser && !userDoc) {
          router.push('/')
      } else if(userDoc) {
          if(userDoc.userType !== "teacher"){
            router.push('/')
          } else if(teacherStudentDoc === null) {
            let x = []
            for(var i = 0; i < userDoc.studentUid.length; i++){
                var docRef = db.collection("students").doc(userDoc.studentUid[i]);
                docRef.get().then((doc) => {
                    console.log("Cached document data:", doc.data());
                    x.push(doc.data());
                }).catch((error) => {
                    console.log(error);
                });
            }
            setTimeout(() => {
                setStudentsDocAsTeacher(x);
              }, 3000);
          }
      }
    }, [authUser, loading, userDoc, teacherStudentDoc])

    const test = async () => {
        console.log("testing...");
    };

    const addStudentSumbit = async (data) => {
    }

      return (
        <>
        {showAddStudentModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <form onSubmit={handleSubmit(addStudentSumbit)}>
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add Student
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <span className="block sm:inline text-red-500">{errors.server?.message}</span>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        key="email"
                        {...register("email")}
                    />
                 </div>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed" style={{visibility: "hidden"}}>
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            </form>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-blueGray-700">
                        Students
                    </h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                    <button
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowAddStudentModal(true)}
                    >
                        Add Student
                    </button>
                    </div>
                </div>
                </div>
                <div className="block w-full overflow-x-auto">
                {/* Projects table */}
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Student Name
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Grade
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Email
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"></th>
                    </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            /argon/
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            4,569
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            340
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <i className="fas fa-info text-gray-500 mr-4" onClick={test}></i>
                            <i className="fas fa-user-edit text-gray-500 mr-4" onClick={test}></i>
                            <i className="fas fa-trash text-red-500 mr-4" onClick={test}></i>
                            </td>
                        </tr> */}
                        {teacherStudentDoc ? teacherStudentDoc.map((student) =>
                                <tr key={student.uid.toString()}>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                {student.name ? student.name : <div>No name set</div>}
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {student.currentGrade ? student.currentGrade : <div>No Grade set for student</div>}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {student.email ? student.email : <div>No Email set for student</div>}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <i className="fas fa-info text-gray-500 mr-4" onClick={test}></i>
                                <i className="fas fa-user-edit text-gray-500 mr-4" onClick={test}></i>
                                <i className="fas fa-trash text-red-500 mr-4" onClick={test}></i>
                                </td>
                                </tr>
                            )
                            :
                            <tr>loading here...</tr>
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </>
      );
}

Students.layout = Admin;

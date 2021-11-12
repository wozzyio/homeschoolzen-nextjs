import React from "react";

// layout for page

import Auth from "layouts/Auth.js";
import {useAuth} from "../../firebase/authUserContext";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import Firebase from "../../firebase/clientApp";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
});

async function someAsync() {
  const db = Firebase.firestore();
  console.log("someAsync called")
  return new Promise(resolve => {
    db.collection("cities").doc("LA").set({
      name: "dudddee Angeles",
      state: "CA",
      country: "USA"
    }).then(() => {
      return;
    })
  })
}

export default function Register() {
  const db = Firebase.firestore();
  const { createUserWithEmailAndPassword, setUserDocument, signInWithEmailAndPassword } = useAuth();
  // const { addTeacherDocument } = useFireStore();
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError} = useForm({
    resolver: yupResolver(schema),
  });

  const setUserDocLocally = async (user, userType) => {
    // TODO: store this in a global react hook store for easy access across pages
    console.log(user);
    console.log(userType);
    await db.collection("users").doc(user.user.uid).set({
      uid: user.user.uid,
      displayName: user.user.displayName,
      photoURL: user.user.photoURL,
      email: user.user.email,
      emailVerified: user.user.emailVerified,
      isNewUser: user.additionalUserInfo.isNewUser,
      userType: userType,
    });
  };

  const sleep = ms => new Promise(resolve => {
    console.log("sleeping.......: " + ms);
    setTimeout(resolve, ms);
  });

  const onSubmit = async (data) => {
    // HACK works for now!!
    // let authUser = await createUserWithEmailAndPassword(data.email, data.password);
    // console.log(authUser)
    // const userDocData = {
    //   uid: authUser.user.uid,
    //   displayName: authUser.user.displayName,
    //   photoURL: authUser.user.photoURL,
    //   email: authUser.user.email,
    //   emailVerified: authUser.user.emailVerified,
    //   isNewUser: authUser.additionalUserInfo.isNewUser,
    //   userType: "teacher",
    // }
    // await setUserDocument(userDocData);
    // router.push('/admin/dashboard');
    await sleep(2000);
    try {
      let authUser = await createUserWithEmailAndPassword(data.email, data.password);
      await sleep(1000);
      // set user doc local as in local to this file as far as the function is concered
      await setUserDocLocally(authUser, "teacher");
      await sleep(1000);
      await signInWithEmailAndPassword(data.email, data.password);
      // set userDoc in global storage
      let userDoc = {
        uid: authUser.user.uid,
        displayName: authUser.user.displayName,
        photoURL: authUser.user.photoURL,
        email: authUser.user.email,
        emailVerified: authUser.user.emailVerified,
        isNewUser: authUser.additionalUserInfo.isNewUser,
        userType: "teacher",
        studentUid: [],
      }
      await setUserDocument(userDoc);
      // move forward to the dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError("server", {
        type: "manual",
        message: err.message,
      });
    }
    // let a = createUserWithEmailAndPassword(data.email, data.password);
    // let b = a.then(function(resultA) {
    //   // some processing
    //   return someAsync();
    // });
    // return Promise.all([a, b]).then(function([resultA, resultB]) {
    //   // more processing
    //   console.log("I'm here and ready to roll at this point");
    //   console.log(resultA);
    //   console.log(resultB);
    //   return // something using both resultA and resultB
    // });
    // console.log(await addTeacherDocument(data.email, data.password));
    // console.log(someAsync());
    // console.log("poop");
    //console.log(authUser);
    //let authUser = createUserWithEmailAndPassword(data.email, data.password);
    // const authUser = await createUserWithEmailAndPassword(data.email, data.password);
    // //await addTeacherDocument(authUser, "teacher");
    // const userDocData = {
    //   uid: authUser.user.uid,
    //   displayName: authUser.user.displayName,
    //   photoURL: authUser.user.photoURL,
    //   email: authUser.user.email,
    //   emailVerified: authUser.user.emailVerified,
    //   isNewUser: authUser.additionalUserInfo.isNewUser,
    //   userType: "teacher",
    // }
    // const x = await addTeacherDocument(authUser, "teacher");
    // console.log(x);
    // await setUserDocument(userDocData);
    // router.push('/admin/dashboard');
    // console.log(x);
    // console.log(x.data);
    // createUserWithEmailAndPassword(data.email, data.password).then(function (authUser){
    //   console.log(authUser);
    //   //const v = await addTeacherDocument(authUser, "teacher");
    //   // addTeacherDocument(authUser, "teacher");
    // }).catch((e) => {
    //   console.log(e);
    // });
    // Firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((authUser) => {
    //   console.log(authUser);
    // }).catch((err) => {
    //   console.log(err);
    // });
    // console.log(authUser);
    // if(authUser){
    //   console.log(authUser);
    //   // console.log(authUser.user.uid);
    //   try {
    //     console.log(authUser.user);
    //     addTeacherDocument(authUser.i, "teacher");
    //     let userDocData = {
    //       uid: authUser.user.uid,
    //       displayName: authUser.user.displayName,
    //       photoURL: authUser.user.photoURL,
    //       email: authUser.user.email,
    //       emailVerified: authUser.user.emailVerified,
    //       isNewUser: authUser.additionalUserInfo.isNewUser,
    //       userType: "teacher",
    //     }
    //     setUserDocument(userDocData);
    //     router.push('/admin/dashboard');
    //   } catch(e) {
    //     // TODO: LOGGER Log this error
    //     console.log("Innn logger error")
    //     console.log(e)
    //     setError("server", {
    //       type: "manual",
    //       message: "Sorry we had an issue on our side please try again later",
    //     });
    //   }
    // } else {
    //   // TODO: LOGGER Log this error
    //   console.log("Innn logger error")
    //   console.log(authUser)
    //   setError("server", {
    //     type: "manual",
    //     message: "Sorry we had an issue on our side please try again later",
    //   });
    // }
    // const authUser = await createUserWithEmailAndPassword(data.email, data.password);
    // console.log(authUser);
    // Firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((authUser) => {
    //   console.log("IN the then functionality at least");
    //   db.collection("cities").doc("Chicago").set({
    //     name: "poop Angeles",
    //     state: "CA",
    //     country: "USA"
    //   })
    //     .then((data) => {
    //       console.log("Document successfully written!");
    //     })
    //     .catch((error) => {
    //       console.error("Error writing document: ", error);
    //     });
    // }).catch((e) => {
    //   console.log("i'm in the error this one: " + e);
    // });
    // createUserWithEmailAndPassword(data.email, data.password).then((authUser) => {
    //   console.log(authUser);
    //   console.log("IN the then functionality at least");
    //   addThings(authUser, "teacher").then(() => {
    //     console.log("I have done it!");
    //   }).catch((e) => {
    //     console.log("i'm in the error: " + e);
    //   });
    // }).catch((e) => {
    //   console.log("i'm in the error this one: " + e);
    // });

    // await addTeacherDocument(authUser, "teacher");
    // createUserWithEmailAndPassword(data.email, data.password).then(authUser => {
    //   console.log(authUser);
    //   //addThings(authUser, "teacher")
    //   // Add a new document in collection "cities"
    //   db.collection("users").doc(authUser.user.uid).set({
    //     uid: authUser.user.uid,
    //     displayName: authUser.user.displayName,
    //     photoURL: authUser.user.photoURL,
    //     email: authUser.user.email,
    //     emailVerified: authUser.user.emailVerified,
    //     isNewUser: authUser.additionalUserInfo.isNewUser,
    //     userType: "teacher",
    //   }).then(function () {
    //     console.log("Document successfully written!");
    //   }).catch(function (error) {
    //     console.error("Error writing document: ", error);
    //   });
      // db.collection("cities").doc("LA").set({
      //   name: "Los Angeles",
      //   state: "CA",
      //   country: "USA"
      // }).then(function () {
      //   console.log("Document successfully written!");
      // }).catch(function (error) {
      //   console.error("Error writing document: ", error);
      // });
    // });
      // db.collection("poop").doc("balling").set({
      //   userType: "teacher",
      // }).then((data) => {
      //   console.log("maybe");
      //   console.log(data);
      // }).catch((error) => {
      //   console.log("in the error lad");
      //   console.log(error);
      // });
      // addThings(authUser, "teacher")
      // let userDocData = {
      //   uid: authUser.user.uid,
      //   displayName: authUser.user.displayName,
      //   photoURL: authUser.user.photoURL,
      //   email: authUser.user.email,
      //   emailVerified: authUser.user.emailVerified,
      //   isNewUser: authUser.additionalUserInfo.isNewUser,
      //   userType: "teacher",
      // }
      // setUserDocument(userDocData);
      // router.push('/admin/dashboard');
          // addTeacherDocument(authUser, "teacher").then((data) => {
          //   let userDocData = {
          //     uid: authUser.user.uid,
          //     displayName: authUser.user.displayName,
          //     photoURL: authUser.user.photoURL,
          //     email: authUser.user.email,
          //     emailVerified: authUser.user.emailVerified,
          //     isNewUser: authUser.additionalUserInfo.isNewUser,
          //     userType: "teacher",
          //   }
          //   console.log("Innn after addTeacherDocument")
          //   setUserDocument(userDocData);
          //   router.push('/admin/dashboard');
          // })
        // }).catch(error => {
        //   // TODO: LOGGER Log this error
        //   console.log("Innn logger error")
        //   console.log(error)
        //   setError("server", {
        //     type: "manual",
        //     message: error.message,
        //   });
        // });
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up with
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img alt="..." className="w-5 mr-1" src="/img/google.svg" />
                    Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <span className="block sm:inline text-red-500">{errors.email?.message}</span>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                        name="password"
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        key="password"
                        {...register("password")}
                    />
                    <span className="block sm:inline text-red-500">{errors.password?.message}</span>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                    >
                      Confirm Password
                    </label>
                    <input
                        name="confirmPassword"
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        key="confirmPassword"
                        // ref={register({
                        //   validate: value =>{
                        //     // value is from confirm and watch will return value from password
                        //
                        //     if (value === getValues('password')) {return true} else {return <span>Password fields don't match</span>}
                        //   },
                        //
                        //   required: 'Password required',
                        //   minLength: { value: 8, message: 'Too short' }
                        // })}
                        {...register("confirmPassword")}
                    />
                    <span className="block sm:inline text-red-500">{errors.confirmPassword?.message}</span>
                  </div>

                  {/*<div>*/}
                  {/*  <label className="inline-flex items-center cursor-pointer">*/}
                  {/*    <input*/}
                  {/*      id="customCheckLogin"*/}
                  {/*      type="checkbox"*/}
                  {/*      className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"*/}
                  {/*    />*/}
                  {/*    <span className="ml-2 text-sm font-semibold text-blueGray-600">*/}
                  {/*      I agree with the{" "}*/}
                  {/*      <a*/}
                  {/*        href="#pablo"*/}
                  {/*        className="text-lightBlue-500"*/}
                  {/*        onClick={(e) => e.preventDefault()}*/}
                  {/*      >*/}
                  {/*        Privacy Policy*/}
                  {/*      </a>*/}
                  {/*    </span>*/}
                  {/*  </label>*/}
                  {/*</div>*/}

                  <div className="text-center mt-6">
                    <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
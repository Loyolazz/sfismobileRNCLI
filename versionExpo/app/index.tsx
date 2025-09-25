import {Redirect} from "expo-router";
import Splash from "@/app/Splash";
export default function Home()  {
    return (
        <Redirect href={'/Splash'}/>
    );
}

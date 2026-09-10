"use client";
import DynamicRouteButton from "@/components/DynamicRouteButton";
import { Button } from "../components/ui/button";


export default function Home() {
  const popup = (name: string) => {
    console.log(`you've clicked on the the ${name}`)
  }


  return (
    <>
      <div>
        Here a normal webpage will come for let the user see button for the form , kanban and builder like this
      </div>
      <div>
        <DynamicRouteButton>Form </DynamicRouteButton>
        <DynamicRouteButton>Kanban</DynamicRouteButton>
        <DynamicRouteButton>Builder </DynamicRouteButton>
      </div>
    </>
  );
}

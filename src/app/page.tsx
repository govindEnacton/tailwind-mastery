import DynamicRouteButton from "@/components/DynamicRouteButton";

export default function Home() {

  return (
    <>
      <div>
        <DynamicRouteButton>Form </DynamicRouteButton>
        <DynamicRouteButton>Kanban</DynamicRouteButton>
        <DynamicRouteButton>Builder </DynamicRouteButton>
      </div>
    </>
  );
}

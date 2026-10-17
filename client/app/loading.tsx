import LoadingScreen from "@/components/LoadingScreen";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row justify-center">
      <LoadingScreen />
    </div>
  );
}

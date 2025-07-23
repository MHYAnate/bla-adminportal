import { Suspense } from "react";
import Settings from "./components";

export default function Settingspage() {
  return (
    <Suspense fallback={"Loading"}>
      <Settings />
    </Suspense>
  );
}

import { useRouter } from "next/navigation";
// @ts-ignore
import * as NProgress from "nprogress";

export const useHandlePush = () => {
  const { push } = useRouter();

  const handlePush = (path: string) => {
    NProgress.start();
    push(path);
  };

  return { handlePush };
};

// // "use client"

// // import React, { useEffect, useState } from "react";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { useForm } from "react-hook-form";
// // import { z } from "zod";
// // import { Button } from "@/components/ui/button";
// // import {  useInviteAdmin } from "@/services/admin/index";
// // import {  RoleData } from "@/types";
// // import { toast } from "sonner";
// // import { useGetAdmins } from "@/services/admin";



// // const formSchema = z.object({
// //   email: z.string().email("Please enter a valid email address"),
// //   role: z.string({
// //     required_error: "Please select a role.",
// //   }),
// // });

// // type FormSchemaType = z.infer<typeof formSchema>;
// // interface IProps {
// //   setClose: () => void;
// //   roles?: RoleData[];
// //   setUrl:(data:string)=>void;
// // }

// // const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {

// //    const[email, setEmail] = useState("");

// //    useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const email = localStorage.getItem("userEmail") || 
// //                    sessionStorage.getItem("userEmail");
// //       // Use the email
// //       setEmail(email? email : "")
// //     }
// //   }, []);

// //   const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
// //   const admin = adminsData?.find((admin: {email : string }) => admin.email === email);

// //   console.log(email, "email", adminsData, "data", admin, "filter" )

// //   //super_admin 
// //   // admin.roles.role.name !==super_admin
 
// //   const { inviteAdminPayload, inviteAdminIsLoading} = useInviteAdmin((data: any) => {
// //     toast.success("Admin invitation sent successfully");
// //     console.log(data, "check reg data");
// //     setUrl(data.data.inviteUrl)
// //      // Use the response data passed to onSuccess
// //     setClose();

// //   });


// //   console.log("inviteRolesss", roles)
// //   // Initialize form with react-hook-form
// //   const form = useForm<FormSchemaType>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       email: "",
// //       role: "",
// //     },
// //   });

// //   // Handle form submission
// //   async function onSubmit(values: FormSchemaType) {
// //     try {
// //       await inviteAdminPayload({
// //         email: values.email,
// //         roleNames: [values.role]
// //       });
// //     } catch (error) {
// //       toast.error("Failed to send admin invitation");
// //       console.error(error);
// //     }
// //   }


// //   return (
// //     <div>
// //       <Form {...form}>
// //         <form
// //           onSubmit={form.handleSubmit(onSubmit)}
// //           className="mb-8 flex flex-col h-full"
// //         >
// //           <div className="mb-6 space-y-4">
// //             <FormField
// //               control={form.control}
// //               name="email"
// //               render={({ field }) => (
// //                 <FormItem className="w-full">
// //                   <FormLabel className="text-[#111827] font-medium text-base">
// //                     Email Address <span className="text-[#E03137]">*</span>
// //                   </FormLabel>
// //                   <FormControl>
// //                     <Input 
// //                       type="email" 
// //                       placeholder="Enter admin email address" 
// //                       className="h-14"
// //                       {...field} 
// //                     />
// //                   </FormControl>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //             <FormField
// //               control={form.control}
// //               name="role"
// //               render={({ field }) => (
// //                 <FormItem className="w-full">
// //                   <FormLabel className="text-[#111827] font-medium text-base">
// //                     Role <span className="text-[#E03137]">*</span>
// //                   </FormLabel>
// //                   <Select
// //                     onValueChange={field.onChange}
// //                     defaultValue={field.value}
// //                   >
// //                     <FormControl>
// //                       <SelectTrigger className="h-14">
// //                         <SelectValue placeholder="Select admin role" />
// //                       </SelectTrigger>
// //                     </FormControl>
// //                     <SelectContent>
// //                       {roles.map((role) => (
// //                         <SelectItem key={role.id} value={role.name}>
// //                           {role.name.replace(/_/g, " ")}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //           </div>
// //           <div className="gap-5 justify-end flex mt-auto">
// //             <Button
// //               variant="outline"
// //               className="w-auto py-4 px-[3rem] font-bold text-base"
// //               size="xl"
// //               onClick={(e) => {
// //                 e.preventDefault();
// //                 setClose();
// //               }}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               disabled={inviteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
// //               variant="warning"
// //               className="w-auto px-[3rem] py-4 font-bold text-base"
// //               size="xl"
// //               type="submit"
// //             >
// //               Submit
// //             </Button>
// //           </div>
// //         </form>
    
// //       </Form>
// //     </div>
// //   );
// // };

// // export default CreateAdmin;

// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";

// const formSchema = z.object({
//   email: z.string().min(5, "Name must be greater 4"),
//   role: z.string({
//     required_error: "Please select a role.",
//   }),
// });

// type FormSchemaType = z.infer<typeof formSchema>;
// interface iProps {
//   setClose: () => void;
// }

// const CreateAdmin: React.FC<iProps> = ({ setClose }) => {
//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       role: "",
//     },
//   });

//   async function onSubmit(values: FormSchemaType) {
//     await Promise.resolve(true);
//     console.warn(values);
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mb-8 flex flex-col h-full"
//         >
//           <div className="mb-6">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="Admin name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Role</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="Admin role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="usdc">USDC</SelectItem>
//                       <SelectItem value="usdt">USDT</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="gap-5 justify-end flex mt-auto">
//             <Button
//               variant="outline"
//               className="w-auto py-4 px-[3rem] font-bold text-base"
//               size="xl"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setClose();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="warning"
//               className="w-auto px-[3rem] py-4 font-bold text-base"
//               size="xl"
//             >
//               Submit
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CreateAdmin;


// "use client"

// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {  useInviteAdmin } from "@/services/admin/index";
// import {  RoleData } from "@/types";
// import { toast } from "sonner";
// import { useGetAdmins } from "@/services/admin";



// const formSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   role: z.string({
//     required_error: "Please select a role.",
//   }),
// });

// type FormSchemaType = z.infer<typeof formSchema>;
// interface IProps {
//   setClose: () => void;
//   roles?: RoleData[];
//   setUrl:(data:string)=>void;
// }

// const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {

//    const[email, setEmail] = useState("");

//    useEffect(() => {
//     if (typeof window !== "undefined") {
//       const email = localStorage.getItem("userEmail") || 
//                    sessionStorage.getItem("userEmail");
//       // Use the email
//       setEmail(email? email : "")
//     }
//   }, []);

//   const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
//   const admin = adminsData?.find((admin: {email : string }) => admin.email === email);

//   console.log(email, "email", adminsData, "data", admin, "filter" )

//   //super_admin 
//   // admin.roles.role.name !==super_admin
 
//   const { inviteAdminPayload, inviteAdminIsLoading} = useInviteAdmin((data: any) => {
//     toast.success("Admin invitation sent successfully");
//     console.log(data, "check reg data");
//     console.log(data.data.inviteUrl, "check url");
//     setUrl(data.data.inviteUrl)
//      // Use the response data passed to onSuccess
//     setClose();

//   });


//   console.log("inviteRolesss", roles)
//   // Initialize form with react-hook-form
//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       role: "",
//     },
//   });

//   // Handle form submission
//   async function onSubmit(values: FormSchemaType) {
//     try {
//       await inviteAdminPayload({
//         email: values.email,
//         roleNames: [values.role]
//       });
//     } catch (error) {
//       toast.error("Failed to send admin invitation");
//       console.error(error);
//     }
//   }


//   return (
//     <div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mb-8 flex flex-col h-full"
//         >
//           <div className="mb-6 space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel className="text-[#111827] font-medium text-base">
//                     Email Address <span className="text-[#E03137]">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="email" 
//                       placeholder="Enter admin email address" 
//                       className="h-14"
//                       {...field} 
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel className="text-[#111827] font-medium text-base">
//                     Role <span className="text-[#E03137]">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="Select admin role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {roles.map((role) => (
//                         <SelectItem key={role.id} value={role.name}>
//                           {role.name.replace(/_/g, " ")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="gap-5 justify-end flex mt-auto">
//             <Button
//               variant="outline"
//               className="w-auto py-4 px-[3rem] font-bold text-base"
//               size="xl"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setClose();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={inviteAdminIsLoading ||admin?.roles[0]?.role?.name !=="super_admin"}
//               variant="warning"
//               className="w-auto px-[3rem] py-4 font-bold text-base"
//               size="xl"
//               type="submit"
//             >
//               Submit
//             </Button>
//           </div>
//         </form>
    
//       </Form>
//     </div>
//   );
// };

// export default CreateAdmin;

// "use client"

// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {  useInviteAdmin } from "@/services/admin/index";
// import { AdminsData, RoleData } from "@/types";
// import { toast } from "sonner";

// const formSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   role: z.string({
//     required_error: "Please select a role.",
//   }),
// });

// type FormSchemaType = z.infer<typeof formSchema>;
// interface IProps {
//   setClose: () => void;
//   roles?: RoleData[];
// }

// const CreateAdmin: React.FC<IProps> = ({ setClose, roles = [] }) => {
//   const { inviteAdminPayload, inviteAdminIsLoading } = useInviteAdmin(() => {
//     toast.success("Admin invitation sent successfully");
//     setClose();
//   });

//   // Initialize form with react-hook-form
//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       role: "",
//     },
//   });

//   // Handle form submission
//   async function onSubmit(values: FormSchemaType) {
//     try {
//       await inviteAdminPayload({
//         email: values.email,
//         roleNames: [values.role]
//       });
//     } catch (error) {
//       toast.error("Failed to send admin invitation");
//       console.error(error);
//     }
//   }


//   return (
//     <div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="mb-8 flex flex-col h-full"
//         >
//           <div className="mb-6 space-y-4">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel className="text-[#111827] font-medium text-base">
//                     Email Address <span className="text-[#E03137]">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <Input 
//                       type="email" 
//                       placeholder="Enter admin email address" 
//                       className="h-14"
//                       {...field} 
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel className="text-[#111827] font-medium text-base">
//                     Role <span className="text-[#E03137]">*</span>
//                   </FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="h-14">
//                         <SelectValue placeholder="Select admin role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {roles.map((role) => (
//                         <SelectItem key={role.id} value={role.name}>
//                           {role.name.replace(/_/g, " ")}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="gap-5 justify-end flex mt-auto">
//             <Button
//               variant="outline"
//               className="w-auto py-4 px-[3rem] font-bold text-base"
//               size="xl"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setClose();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={inviteAdminIsLoading}
//               variant="warning"
//               className="w-auto px-[3rem] py-4 font-bold text-base"
//               size="xl"
//               type="submit"
//             >
//               Submit
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CreateAdmin;

"use client"

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {  useInviteAdmin } from "@/services/admin/index";
import { AdminsData, RoleData } from "@/types";
import { toast } from "sonner";


const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string({
    required_error: "Please select a role.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;
interface IProps {
  setClose: () => void;
  roles?: RoleData[];
  setUrl:(data:string)=>void;
}

const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {

 
  const { inviteAdminPayload, inviteAdminIsLoading} = useInviteAdmin((data: any) => {
    toast.success("Admin invitation sent successfully");
    console.log(data, "check reg data");
    setUrl(data.data.inviteUrl)
     // Use the response data passed to onSuccess
    setClose();

  });


  console.log("inviteRolesss", roles)
  // Initialize form with react-hook-form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: FormSchemaType) {
    try {
      await inviteAdminPayload({
        email: values.email,
        roleNames: [values.role]
      });
    } catch (error) {
      toast.error("Failed to send admin invitation");
      console.error(error);
    }
  }


  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-8 flex flex-col h-full"
        >
          <div className="mb-6 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#111827] font-medium text-base">
                    Email Address <span className="text-[#E03137]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter admin email address" 
                      className="h-14"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#111827] font-medium text-base">
                    Role <span className="text-[#E03137]">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem className={role.name !== "admin" ? "hidden":""} key={role.id} value={role.name}>
                          {role.name.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-5 justify-end flex mt-auto">
            <Button
              variant="outline"
              className="w-auto py-4 px-[3rem] font-bold text-base"
              size="xl"
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={inviteAdminIsLoading}
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
    
      </Form>
    </div>
  );
};

export default CreateAdmin;
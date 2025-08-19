// "use client";

// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

// interface ErrorBoundaryState {
//     hasError: boolean;
//     error?: Error;
//     errorInfo?: React.ErrorInfo;
// }

// interface ErrorBoundaryProps {
//     children: React.ReactNode;
//     fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
//     onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
// }

// export class ErrorBoundary extends React.Component<
//     ErrorBoundaryProps,
//     ErrorBoundaryState
// > {
//     constructor(props: ErrorBoundaryProps) {
//         super(props);
//         this.state = { hasError: false };
//     }

//     static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//         return { hasError: true, error };
//     }

//     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//         console.error('🔍 Error Boundary caught an error:', error, errorInfo);

//         // Log the error details for debugging
//         console.error('Error details:', {
//             message: error.message,
//             stack: error.stack,
//             componentStack: errorInfo.componentStack,
//         });

//         this.setState({ errorInfo });

//         // Call the onError callback if provided
//         if (this.props.onError) {
//             this.props.onError(error, errorInfo);
//         }

//         // Don't redirect to login for component errors
//         // Only redirect for authentication errors
//         if (error.message.includes('auth') || error.message.includes('401')) {
//             console.log('🔍 Authentication error detected, redirecting to login');
//             setTimeout(() => {
//                 window.location.href = '/login';
//             }, 2000);
//         }
//     }

//     handleRetry = () => {
//         this.setState({ hasError: false, error: undefined, errorInfo: undefined });
//     };

//     render() {
//         if (this.state.hasError) {
//             // Use custom fallback if provided
//             if (this.props.fallback) {
//                 const FallbackComponent = this.props.fallback;
//                 return (
//                     <FallbackComponent
//                         error={this.state.error!}
//                         retry={this.handleRetry}
//                     />
//                 );
//             }

//             // Default fallback UI
//             return (
//                 <Card className="max-w-lg mx-auto mt-8">
//                     <CardContent className="p-6 text-center">
//                         <div className="mb-4">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//                                 Something went wrong
//                             </h2>
//                             <p className="text-gray-600 mb-4">
//                                 There was an error loading this component
//                             </p>

//                             {/* Show error details in development */}
//                             {process.env.NODE_ENV === 'development' && this.state.error && (
//                                 <details className="text-left bg-gray-100 p-3 rounded text-sm mb-4">
//                                     <summary className="cursor-pointer font-medium">
//                                         Error Details (Development Only)
//                                     </summary>
//                                     <pre className="mt-2 text-xs overflow-auto">
//                                         {this.state.error.message}
//                                         {'\n\n'}
//                                         {this.state.error.stack}
//                                     </pre>
//                                 </details>
//                             )}
//                         </div>

//                         <div className="flex gap-3 justify-center">
//                             <Button
//                                 variant="outline"
//                                 onClick={this.handleRetry}
//                             >
//                                 Try Again
//                             </Button>
//                             <Button
//                                 onClick={() => window.location.reload()}
//                             >
//                                 Reload Page
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             );
//         }

//         return this.props.children;
//     }
// }

// // Higher-order component for wrapping components with error boundary
// export function withErrorBoundary<P extends object>(
//     Component: React.ComponentType<P>,
//     fallback?: React.ComponentType<{ error: Error; retry: () => void }>
// ) {
//     const WrappedComponent = (props: P) => (
//         <ErrorBoundary fallback={fallback}>
//             <Component {...props} />
//         </ErrorBoundary>
//     );

//     WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

//     return WrappedComponent;
// }

// // Specialized error boundary for orders
// export const OrdersErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//     <ErrorBoundary
//         fallback={({ error, retry }) => (
//             <Card className="max-w-4xl mx-auto mt-8">
//                 <CardContent className="p-6 text-center">
//                     <h2 className="text-xl font-semibold text-gray-800 mb-2">
//                         Orders Page Error
//                     </h2>
//                     <p className="text-gray-600 mb-4">
//                         There was an error loading the orders page. This might be due to a component issue.
//                     </p>
//                     <div className="flex gap-3 justify-center">
//                         <Button variant="outline" onClick={retry}>
//                             Try Again
//                         </Button>
//                         <Button onClick={() => window.location.href = '/admin/dashboard'}>
//                             Go to Dashboard
//                         </Button>
//                         <Button
//                             variant="destructive"
//                             onClick={() => window.location.reload()}
//                         >
//                             Reload Page
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         )}
//         onError={(error, errorInfo) => {
//             // Log specific order page errors
//             console.error('🔍 Orders page error:', { error, errorInfo });

//             // Don't redirect to login for Select component errors
//             if (error.message.includes('Select.Item')) {
//                 console.log('🔍 Select component error - not an auth issue');
//             }
//         }}
//     >
//         {children}
//     </ErrorBoundary>
// );
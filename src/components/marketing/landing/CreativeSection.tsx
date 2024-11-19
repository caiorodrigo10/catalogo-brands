import { Button } from "@/components/ui/button";
import { Instagram, ShoppingBag } from "lucide-react";

export const CreativeSection = () => {
  return (
    <>
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              On-brand creative, built end-to-end
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              From brand strategy to product launch, we create your complete brand identity. 
              Schedule a call to start building your brand today.
            </p>
            <Button 
              size="lg"
              className="bg-[#F16529] hover:bg-[#F16529]/90 text-white font-semibold px-8 py-6 text-lg"
            >
              BOOK A CALL
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How it works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Select Products</h3>
              <p className="text-gray-600">
                Choose from our wide range of high-quality products that match your brand vision and market needs.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Brand</h3>
              <p className="text-gray-600">
                We develop your brand identity and design custom packaging that stands out in the market.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl font-semibold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Sell</h3>
              <p className="text-gray-600">
                Launch your products and start selling with our complete support and guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F2FCE2]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="w-full aspect-square relative">
              <div className="w-full aspect-square relative">
                <div className="absolute inset-0" style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  overflow: "hidden",
                  background: "white",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                }}>
                  <iframe 
                    src="https://streamable.com/e/p4l1fu?quality=highest&autoplay=1&controls=0" 
                    frameBorder="0" 
                    width="100%" 
                    height="100%" 
                    allowFullScreen 
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) scale(1.2)",
                      pointerEvents: "none"
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Focus on growth, let us take care of the logistics
              </h2>
              
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold">Sell on</span>
                <div className="flex items-center gap-4">
                  <ShoppingBag className="w-8 h-8 text-[#96BF48]" />
                  <Instagram className="w-8 h-8 text-[#E4405F]" />
                </div>
              </div>

              <p className="text-xl text-gray-600">
                GetBrands silently takes care of the product, packaging, and shipping for you. No upfront fees.
              </p>

              <div>
                <h3 className="text-xl font-semibold mb-2 inline-block border-b-2 border-gray-900">
                  How it works
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4ADE80] bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 text-[#4ADE80]">
                      🔔
                    </div>
                  </div>
                  <p className="text-lg font-medium">
                    WE RECEIVE YOUR STORE ORDERS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
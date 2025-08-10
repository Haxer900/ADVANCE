import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Ruler, Info } from "lucide-react";

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-zenthra-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-zenthra-gold mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-poppins text-5xl md:text-6xl font-bold mb-6">
              Size Guide
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              Find your perfect fit with our comprehensive size guide. Accurate measurements for the best shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              How to Measure
            </h2>
            <p className="text-xl text-zenthra-gray">
              Follow these simple steps to get accurate measurements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-0 shadow-lg">
              <Ruler className="w-12 h-12 text-zenthra-primary mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Chest/Bust
              </h3>
              <p className="text-zenthra-gray">
                Measure around the fullest part of your chest/bust, keeping the tape measure level and snug but not tight.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <Ruler className="w-12 h-12 text-zenthra-primary mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Waist
              </h3>
              <p className="text-zenthra-gray">
                Measure around your natural waistline, which is the narrowest part of your torso, usually just above your hip bones.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <Ruler className="w-12 h-12 text-zenthra-primary mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Hips
              </h3>
              <p className="text-zenthra-gray">
                Measure around the fullest part of your hips, typically 7-9 inches below your natural waistline.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <Ruler className="w-12 h-12 text-zenthra-primary mb-6" />
              <h3 className="font-poppins text-2xl font-bold text-zenthra-primary mb-4">
                Inseam
              </h3>
              <p className="text-zenthra-gray">
                Measure from the top of your inner thigh down to your ankle bone. This measurement is crucial for pants and dresses.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Size Charts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-zenthra-primary mb-6">
              Size Charts
            </h2>
            <p className="text-xl text-zenthra-gray">
              Use our detailed size charts to find your perfect fit
            </p>
          </div>

          {/* Women's Clothing */}
          <div className="mb-16">
            <h3 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8 text-center">
              Vestments (Women's Clothing)
            </h3>
            <Card className="overflow-x-auto border-0 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-zenthra-primary text-white">
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Chest (inches)</th>
                    <th className="px-4 py-3 text-left font-semibold">Waist (inches)</th>
                    <th className="px-4 py-3 text-left font-semibold">Hips (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">XS</td>
                    <td className="px-4 py-3">32-34</td>
                    <td className="px-4 py-3">24-26</td>
                    <td className="px-4 py-3">34-36</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">S</td>
                    <td className="px-4 py-3">34-36</td>
                    <td className="px-4 py-3">26-28</td>
                    <td className="px-4 py-3">36-38</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">M</td>
                    <td className="px-4 py-3">36-38</td>
                    <td className="px-4 py-3">28-30</td>
                    <td className="px-4 py-3">38-40</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">L</td>
                    <td className="px-4 py-3">38-41</td>
                    <td className="px-4 py-3">30-33</td>
                    <td className="px-4 py-3">40-43</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">XL</td>
                    <td className="px-4 py-3">41-44</td>
                    <td className="px-4 py-3">33-36</td>
                    <td className="px-4 py-3">43-46</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">XXL</td>
                    <td className="px-4 py-3">44-47</td>
                    <td className="px-4 py-3">36-39</td>
                    <td className="px-4 py-3">46-49</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* Men's Clothing */}
          <div className="mb-16">
            <h3 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8 text-center">
              Breeches (Men's Clothing)
            </h3>
            <Card className="overflow-x-auto border-0 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-zenthra-primary text-white">
                    <th className="px-4 py-3 text-left font-semibold">Size</th>
                    <th className="px-4 py-3 text-left font-semibold">Chest (inches)</th>
                    <th className="px-4 py-3 text-left font-semibold">Waist (inches)</th>
                    <th className="px-4 py-3 text-left font-semibold">Neck (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">S</td>
                    <td className="px-4 py-3">34-36</td>
                    <td className="px-4 py-3">28-30</td>
                    <td className="px-4 py-3">14-14.5</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">M</td>
                    <td className="px-4 py-3">38-40</td>
                    <td className="px-4 py-3">32-34</td>
                    <td className="px-4 py-3">15-15.5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">L</td>
                    <td className="px-4 py-3">42-44</td>
                    <td className="px-4 py-3">36-38</td>
                    <td className="px-4 py-3">16-16.5</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">XL</td>
                    <td className="px-4 py-3">46-48</td>
                    <td className="px-4 py-3">40-42</td>
                    <td className="px-4 py-3">17-17.5</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">XXL</td>
                    <td className="px-4 py-3">50-52</td>
                    <td className="px-4 py-3">44-46</td>
                    <td className="px-4 py-3">18-18.5</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* International Sizes */}
          <div>
            <h3 className="font-poppins text-3xl font-bold text-zenthra-primary mb-8 text-center">
              International Size Conversion
            </h3>
            <Card className="overflow-x-auto border-0 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-zenthra-primary text-white">
                    <th className="px-4 py-3 text-left font-semibold">US</th>
                    <th className="px-4 py-3 text-left font-semibold">UK</th>
                    <th className="px-4 py-3 text-left font-semibold">EU</th>
                    <th className="px-4 py-3 text-left font-semibold">IT</th>
                    <th className="px-4 py-3 text-left font-semibold">FR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">XS</td>
                    <td className="px-4 py-3">6</td>
                    <td className="px-4 py-3">32</td>
                    <td className="px-4 py-3">38</td>
                    <td className="px-4 py-3">34</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">S</td>
                    <td className="px-4 py-3">8</td>
                    <td className="px-4 py-3">34</td>
                    <td className="px-4 py-3">40</td>
                    <td className="px-4 py-3">36</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium">M</td>
                    <td className="px-4 py-3">10</td>
                    <td className="px-4 py-3">36</td>
                    <td className="px-4 py-3">42</td>
                    <td className="px-4 py-3">38</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-medium">L</td>
                    <td className="px-4 py-3">12</td>
                    <td className="px-4 py-3">38</td>
                    <td className="px-4 py-3">44</td>
                    <td className="px-4 py-3">40</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">XL</td>
                    <td className="px-4 py-3">14</td>
                    <td className="px-4 py-3">40</td>
                    <td className="px-4 py-3">46</td>
                    <td className="px-4 py-3">42</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 border-0 shadow-lg text-center">
            <Info className="w-16 h-16 text-zenthra-primary mx-auto mb-6" />
            <h2 className="font-poppins text-3xl font-bold text-zenthra-primary mb-6">
              Need Help Finding Your Size?
            </h2>
            <p className="text-xl text-zenthra-gray mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help you find the perfect fit. Contact us for personalized sizing assistance.
            </p>
            <Link href="/contact">
              <Button className="text-white hover:bg-zenthra-gold text-lg px-8 py-4 rounded-3xl transition-all duration-300 traveling-border">
                Contact Size Expert
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
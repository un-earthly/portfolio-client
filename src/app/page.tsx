import Hero from "@/components/hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import Head from "next/head";

export default function Home() {
  const skills = {
    specialized: ['React & Next.js', 'Redux', 'TypeScript', 'Node & Express JS', 'MongoDB', 'PostgreSQL', 'Vue & Nuxt.js'],
    comfortable: ['Docker', 'React Native', 'Flutter', 'Web Socket', 'AWS EC2', 'S3', 'Redis', 'MSSQL', 'MySQL'],
    tools: ['Git/Github', 'Firebase', 'Stripe', 'Figma', 'NPM', 'Trello', 'Postman', 'ChatGPT']
  };
  return (
    <div className="min-h-screen h-80 pb-10 overflow-y-auto text-gray-300">

      <Hero />
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Achievements</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>LMS Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Developed and published an LMS serving 3,000+ users, showcasing scalability and user-centric design.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>E-commerce Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Delivered 5 e-commerce applications, including Flutter and React Native solutions for international clients.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>ERP Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Led frontend team in developing and designing an ERP management prototype, demonstrating leadership and technical expertise.</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>Project Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Currently leading two system management projects for USA-based clients, focusing on scalable and efficient solutions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Expertise</h2>
          <div className="grid gap-8">
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>Core Technologies</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.specialized.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>Additional Competencies</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.comfortable.map((skill) => (
                  <Badge key={skill} variant="outline" className='text-gray-400'>{skill}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <CardTitle>Tools & Platforms</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {skills.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className='text-gray-400'>{tool}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Professional Experience</h2>
          <div className="grid gap-8">
            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <div className='text-gray-100'>
                    <CardTitle>Project Manager</CardTitle>
                    <p className="text-sm text-muted-foreground">Masleap Plc • August 2024 - Present</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Leading two system management projects for USA-based clients</li>
                  <li>Designing ERDs and system architecture for scalable solutions</li>
                  <li>Mentoring junior developers and conducting Scrum ceremonies</li>
                  <li>Creating Low-Level and High-Level Designs for efficient development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <div className='text-gray-100'>
                    <CardTitle>Software Engineer</CardTitle>
                    <p className="text-sm text-muted-foreground">TNC Global Limited • November 2023 - July 2024</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Led frontend team in developing ERP management prototype</li>
                  <li>Developed and maintained applications using React JS and Next.js</li>
                  <li>Deployed applications to AWS EC2 for scalable cloud solutions</li>
                  <li>Mentored junior developers and resolved complex UI challenges</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  <div>
                    <CardTitle>Front-End Developer</CardTitle>
                    <p className="text-sm text-muted-foreground">Premium Solutions Limited • March 2023 - June 2024</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Implemented frontend for 5 e-commerce projects</li>
                  <li>Developed using Flutter, Vue.js, and Next.js for diverse client needs</li>
                  <li>Specialized in responsive and user-friendly interfaces</li>
                  <li>Integrated frontend with backend APIs for seamless functionality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Elevate Your Digital Presence?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss how my expertise in full-stack development and cloud solutions can drive your project to success.
          </p>
          <Button asChild size="lg">
            <a href="mailto:vijayalamin@gmail.com">
              Schedule a Consultation
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

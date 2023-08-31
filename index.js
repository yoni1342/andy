import { config } from "dotenv";
config();

import { SequentialChain, LLMChain } from "langchain/chains";
import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const LearningMaterialGenerator = async (motherTongue, country, age, level) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().describe("answer to the user's question"),
      sources: z
        .array(z.string())
        .describe("sources used to answer the question, should be websites."),
    })
  );

  const formatInstructions = parser.getFormatInstructions();
  const model = new OpenAI({ temperature: 0.9 });

  // console.log(formatInstructions);

  let template =
    "As an expert in accent reduction, your insights are invaluable for speakers of {motherTongue} aiming to embrace a Native American English accent. The phonetic disparities between the two languages often present unique challenges. Speakers from {country} adapting to an American English accent may encounter variations in vowel sounds, consonant articulations, and intonation patterns.By recognizing these distinctions, you can offer a list of all the sounds that are different between the two languages. This will help your students to identify the sounds they need to work on.";

  let prompt = new PromptTemplate({
    template,
    inputVariables: ["motherTongue", "country"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const straggleChain = new LLMChain({
    llm: model,
    prompt,
    outputKey: "struggle",
  });

  template =
    "Generate a personalized tutorial for accent reduction: Level {level} for {age} year old the student have the following struggle with the mothertoung: {struggle} In this tutorial, you'll teach techniques to improve your accent and pronunciation. The tutorial will cover the following struggles: {struggle} \n\nPlease provide step-by-step instructions and explanations for each topic. Include examples and exercises that users can practice to enhance their accent reduction skills.\n\nRemember to focus on clarity and simplicity, as users of varying language backgrounds will be following this tutorial. Use a friendly and encouraging tone to keep users engaged throughout the learning process.\n\nFeel free to use relevant terminology and provide context as needed. The goal is to empower users with practical strategies to achieve better pronunciation and reduce their accent effectively.";
  prompt = new PromptTemplate({
    template,
    inputVariables: ["struggle", "age", "level"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const lessonChain = new LLMChain({
    llm: model,
    prompt,
    outputKey: "lesson",
  });

  template =
    "Generate a personalized practice exercise for accent reduction. Level {level} for {age} year old the student have the following struggle with the mothertoung: {struggle}. \n\n The exercise is one passage that the student will read out loud. The passage should be at least 100 words long. the passage will help student master the {struggle} by challenging way.";

  prompt = new PromptTemplate({
    template,
    inputVariables: ["struggle", "age", "level" , "lesson"],
    partialVariables: { format_instructions: formatInstructions },
  });

  const exerciseChain = new LLMChain({
    llm: model,
    prompt,
    outputKey: "exercise",
  });

  const overallChain = new SequentialChain({
    chains: [straggleChain, lessonChain, exerciseChain],
    inputVariables: ["motherTongue", "country", "age", "level"],
    outputVariables: ["struggle", "lesson", "exercise"],
  });

  const result = await overallChain.call({
    motherTongue: motherTongue,
    country: country,
    age: age,
    level: level,
  });

  console.log(await parser.parse(result));
};

LearningMaterialGenerator("Amharic", "Ethiopia", 21, 0);

// const input = await prompt.format({
//   motherTongue: motherTongue,
//   country: country,
// });

// const result = await model.call(input);

// console.log(input);
// console.log(result);
// console.log(await parser.parse(result));
// return result;
//   const formatInstructions = parser.getFormatInstructions();

//   console.log(formatInstructions);

//   // const llm = new OpenAI({ temperature: 0 });
//   const template =
//     "As an expert in accent reduction, your insights are invaluable for speakers of {motherTongue} aiming to embrace a Native American English accent. The phonetic disparities between the two languages often present unique challenges. Speakers from {country} adapting to an American English accent may encounter variations in vowel sounds, consonant articulations, and intonation patterns.By recognizing these distinctions, you can offer a list of all the sounds that are different between the two languages. This will help your students to identify the sounds they need to work on.";

//   let prompt = new PromptTemplate({
//     template,
//     inputVariables: ["motherTongue", "country"],
//     partialVariables: { format_instructions: formatInstructions },
//   });

//   //   const chain = new LLMChain({
//   //     llm,
//   //     prompt,
//   //   });
//   //   const struggleChain = new SequentialChain({
//   //     llm,
//   //     prompt: promptTemplate,
//   //     outputKey: "struggle",
//   //   });

//   //   const overallChain = new SequentialChain({
//   //     chains: [struggleChain],
//   //     inputVariables: ["motherTongue", "country"],
//   //     outputVariables: ["struggle"],
//   //   });

//   //   const result = await overallChain.call({
//   //     motherTongue,
//   //     country,
//   //     });
//   const model = new OpenAI({ temperature: 0 });

//   const input = await prompt.format({
//     motherTongue: motherTongue,
//     country: country,
//   });

//   const result = await model.call(input);
//   //   const result = await chain.call({
//   //     motherTongue: motherTongue,
//   //     country: country,
//   //   });

//   console.log(await parser.parse(result));
//   return result;
// };

// LearningMaterialGenerator("Amharic", "Ethiopia");

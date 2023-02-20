declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_KEY: string
        }
    }

    namespace jest {
        interface ImageToTextImages {
            numericImage: string
            textImage: string
            externalImage: string
        }

        interface ImageToTextTaskIds {
            numericImage: number
            textImage: number
            externalImage: number
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}

import { PluginOption } from 'vite'
import { ScriptProcessor } from './processor'
import { Options } from './typings'

export default function(options: Options): PluginOption {
    
    const normalizedOptions = { ...options } as Options
    const processor = new ScriptProcessor(normalizedOptions)

    return {
        name: 'single-script',
        async generateBundle(options, bundle, isWrite) {
            await processor.generateBundle(this, bundle)
        }
    }
}

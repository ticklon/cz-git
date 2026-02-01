import process from 'node:process'
import path from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { style } from 'cz-git'

export function setupAIConfig(token?: string, apiProxy?: string, unsetProxy?: boolean, apiEndpoint?: string, apiModel?: string, aiType?: string) {
    const configDir = path.join(homedir(), '.config')
    const configFile = path.join(configDir, '.czrc')
    try {
        if (!existsSync(configDir))
            mkdirSync(configDir, { recursive: true })

        const updateConfig: any = {
            apiProxy,
            apiEndpoint,
            apiModel,
            aiType,
        }
        if (token) {
            if (aiType === 'gemini') {
                updateConfig.geminiToken = token
            }
            else {
                updateConfig.openAIToken = token
            }
        }

        if (!existsSync(configFile)) {
            writeFileSync(configFile, JSON.stringify(updateConfig), 'utf8')
        }
        else {
            const originConfig: any = JSON.parse(readFileSync(configFile, 'utf8'))
            const result = {
                openAIToken: updateConfig.openAIToken || originConfig.openAIToken,
                geminiToken: updateConfig.geminiToken || originConfig.geminiToken,
                apiProxy: updateConfig.apiProxy || originConfig.apiProxy,
                apiEndpoint: updateConfig.apiEndpoint || originConfig.apiEndpoint,
                apiModel: updateConfig.apiModel || originConfig.apiModel,
                aiType: updateConfig.aiType || originConfig.aiType,
            }
            if (unsetProxy)
                delete result?.apiProxy
            writeFileSync(configFile, JSON.stringify(result), 'utf8')
        }
    }
    catch (e) {
        console.log(style.red('>>> Setup AI config failure. The sugguestion save $HOME/.czrc or $HOME/.config/.czrc as json format'))
        console.error(e)
        process.exit(1)
    }
    console.log(style.green('>>> Setup AI config on'), style.underline(style.yellow(configFile)), style.green('successfully'))
}

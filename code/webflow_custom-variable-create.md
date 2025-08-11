
createColorVariable: async () => {
      // Get Collection
      const collection = await webflow.getDefaultVariableCollection()

      // Create Color Variable with a HEX Codre
      const myColorVariable = await collection?.createColorVariable(
        'VarColor1',
        '#5E688D',
      )
      console.log(myColorVariable)
    }


createCustomColorVariable: async () => {
      // Get Collection
      const collection = await webflow.getDefaultVariableCollection()

      // Create Color Variable
      const webflowColor = await collection?.createColorVariable(
        'Base VarColor1',
        '#5E688D',
      )

      // Get the binding to the webflowColor variable
      const webflowColorBinding = await webflowColor?.getBinding()

      // Function to create a string that uses the binding and CSS color-mix function
      const colorMix = (binding, color, opacity) =>
        `color-mix(in srgb, ${binding} , ${color} ${opacity}%)`

      // Create a color variable that uses a CSS function
      const webflowColor400 = await collection?.createColorVariable('Base VarColor1', {
        type: 'custom',
        value: colorMix(webflowColorBinding, '#fff', 60),
      })
      console.log(webflowColor400)
    }
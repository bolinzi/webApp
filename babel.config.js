module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
        // [
        //     'es2015',
        //     {
        //         modules: false
        //     }
        // ]
    ],
    plugins: [
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            // 指定样式路径
            style: (name) => `${name}/style/less`
        }, 'vant']
    ]
};

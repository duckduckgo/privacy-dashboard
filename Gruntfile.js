module.exports = function (grunt) {
    const path = require('path')
    const sass = require('sass')
    require('load-grunt-tasks')(grunt)
    grunt.loadNpmTasks('grunt-execute')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-watch')

    const watch = grunt.option('watch')
    const debug = grunt.option('debug')

    // only add `iframe.html` when we're in watch mode
    const htmlFiles = ['popup.html']
    if (watch) {
        htmlFiles.push('iframe.html')
    }

    const appBuildPath = path.join('build', 'app')

    const baseFileMap = {
        ui: {
            '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/ui/base/index.es6.js'],
            '<%= dirs.public.js %>/polyfills.js': ['<%= dirs.src.js %>/polyfill.js'],
        },
        sass: {
            '<%= dirs.public.css %>/base.css': ['<%= dirs.src.scss %>/base/base.scss'],
            '<%= dirs.public.css %>/popup.css': ['<%= dirs.src.scss %>/popup.scss'],
            '<%= dirs.public.css %>/android.css': ['<%= dirs.src.scss %>/android.scss'],
        },
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            cache: '.cache',
            src: {
                js: 'shared/js',
                scss: 'shared/scss',
            },
            data: 'shared/data',
            public: {
                js: `${appBuildPath}/public/js`,
                css: `${appBuildPath}/public/css`,
            },
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: Boolean(watch) && Boolean(debug),
                },
                transform: [['babelify'], ['require-globify']],
            },
            ui: {
                files: baseFileMap.ui,
            },
        },

        sass: {
            options: {
                implementation: sass,
                sourceMap: Boolean(watch) && Boolean(debug),
                includePaths: [path.resolve(process.cwd(), 'node_modules')],
            },
            dist: {
                files: baseFileMap.sass,
            },
        },

        copy: {
            html: {
                expand: true,
                cwd: 'shared/html',
                src: htmlFiles,
                dest: `${appBuildPath}/html`,
            },
            index: {
                src: 'shared/html/index.html',
                dest: `${appBuildPath}/index.html`,
            },
            polyfillLoader: {
                src: 'shared/js/polyfill-loader.js',
                dest: `${appBuildPath}/public/js/polyfill-loader.js`,
            },
            font: {
                expand: true,
                cwd: 'shared',
                src: 'font/**',
                dest: `${appBuildPath}/`,
            },
            images: {
                expand: true,
                cwd: 'shared',
                src: 'img/**',
                dest: `${appBuildPath}/`,
            },
        },
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            sass: {
                files: ['shared/scss/**/*'],
                tasks: ['sass'],
            },
            scripts: {
                files: ['shared/js/**/*', 'shared/html/**/*', 'shared/locales/**/*', 'fixtures/**/*.json', 'schema/**/*.json'],
                tasks: ['exec:schema', 'browserify:ui', 'copy:html', 'copy:font', 'copy:index', 'copy:polyfillLoader', 'exec:buildHtml'],
            },
            images: {
                files: ['shared/img/**/*'],
                tasks: ['copy:images'],
            },
        },
        exec: {
            schema: 'npm run schema',
            buildHtml: 'node scripts/duplicate-html.js',
        },
    })

    grunt.registerTask('build', 'Build project(s)css, templates, js', [
        'exec:schema',
        'sass',
        'browserify:ui',
        'copy:html',
        'copy:font',
        'copy:index',
        'copy:polyfillLoader',
        'copy:images',
        'exec:buildHtml',
    ])
    grunt.registerTask('default', 'build')
    grunt.registerTask('dev', ['default', 'watch'])
}

module.exports = function (grunt) {
    const path = require('path')
    const sass = require('sass')
    require('load-grunt-tasks')(grunt)
    grunt.loadNpmTasks('grunt-execute')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-watch')

    const platform = grunt.option('platform') || 'example'
    const watch = grunt.option('watch')

    // only add `iframe.html` to 'example' platform for testing multiple screens
    const htmlFiles = ['popup.html']
    if (platform === 'example') {
        htmlFiles.push('iframe.html')
    }

    let buildPath = path.join('build', platform)

    // Output builds for apple devices to the swift package
    if (platform === 'ios' || platform === 'macos') {
        buildPath = `swift-package/Resources/${platform}/assets`
    }

    const baseFileMap = {
        ui: {
            '<%= dirs.public.js %>/base.js': ['<%= dirs.src.js %>/ui/base/index.es6.js']
        },
        sass: {
            '<%= dirs.public.css %>/base.css': ['<%= dirs.src.scss %>/base/base.scss'],
            '<%= dirs.public.css %>/popup.css': ['<%= dirs.src.scss %>/popup.scss']
        }
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            cache: '.cache',
            src: {
                js: 'shared/js',
                scss: 'shared/scss'
            },
            data: 'shared/data',
            public: {
                js: `${buildPath}/public/js`,
                css: `${buildPath}/public/css`
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: Boolean(watch)
                },
                transform: [
                    ['babelify'],
                    ['require-globify']
                ]
            },
            ui: {
                files: baseFileMap.ui
            }
        },

        sass: {
            options: {
                implementation: sass,
                sourceMap: Boolean(watch),
                includePaths: [
                    path.resolve(process.cwd(), 'node_modules')
                ]
            },
            dist: {
                files: baseFileMap.sass
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: 'shared/html',
                src: htmlFiles,
                dest: `${buildPath}/html`,
                options: {
                    process: (content) => content.replace(/\$ENVIRONMENT/g, platform)
                }
            },
            index: {
                src: 'shared/html/index.html',
                dest: `${buildPath}/index.html`
            },
            images: {
                expand: true,
                cwd: 'shared',
                src: 'img/**',
                dest: `${buildPath}/`
            }
        },
        /**
         * Run predefined tasks whenever watched files are added,
         * modified or deleted.
         */
        watch: {
            sass: {
                files: ['shared/scss/**/*'],
                tasks: ['sass']
            },
            scripts: {
                files: ['shared/js/**/*', 'shared/html/**/*', 'shared/locales/**/*', 'fixtures/**/*.json', 'schema/**/*.json'],
                tasks: ['exec:schema', 'browserify:ui', 'copy:html', 'copy:index']
            }
        },
        exec: {
            schema: 'npm run schema'
        }
    })

    grunt.registerTask('build', 'Build project(s)css, templates, js', ['exec:schema', 'sass', 'browserify:ui', 'copy:html', 'copy:index', 'copy:images'])
    grunt.registerTask('default', 'build')
    grunt.registerTask('dev', ['default', 'watch'])
}

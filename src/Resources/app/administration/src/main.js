import { Component } from 'src/core/shopware';
import ClassicEditor from './ckeditor/ckeditor';
import template from './extension/sw-ckeditor.html.twig';
import './sw-ckeditor.scss';
import './ckeditor/translations/de';

Component.override('sw-text-editor', {
    template,

    inject: ['systemConfigApiService'],

    data() {
        return {
            mediaModalIsOpen: false,
            domain: 'AvencyCKEditor'
        };
    },

    methods: {
        onCloseMediaModal() {
            this.mediaModalIsOpen = false;
        },

        onOpenMediaModal() {
            this.mediaModalIsOpen = true;
        },

        onMediaSelectionChange(mediaItems) {
            const urls = [];
            mediaItems.forEach((item) => {
                urls.push(item.url);
            });
            this.ckeditor.execute('imageInsert', {
                source: urls
            });
        },

        readAll() {
            return this.systemConfigApiService.getValues(this.domain, this.selectedSalesChannelId);
        },

        loadEditor() {
            const lang = Shopware.Application.getContainer('factory').locale.getLastKnownLocale();

            this.ckeditor = ClassicEditor
                .create(this.$refs.textArea, {
                    language: lang.substring(0, 2)
                })
                .then(editor => {
                    this.ckeditor = editor;
                    editor.swComponet = this;
                    editor.model.document.on('change:data', () => {
                        const value = editor.getData();
                        this.content = value;
                        this.$emit('input', value);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },

        mapValues: function (values) {
            const config = {};
            Object.keys(values).forEach(key => {
                const newKey = key.replace('AvencyCKEditor.config.', '');
                config[newKey] = values[key];
            });
            return config;
        },

        emitHtmlContent(value) {
            this.content = value;
            this.$emit('input', value);
            this.ckeditor.setData(value);
        }
    },

    mounted() {
        if (this.isInlineEdit) {
            this.mountedComponent();
            return;
        }
        if (!window.ckeditorConfig) {
            this.readAll().then((values) => {
                window.ckeditorConfig = this.mapValues(values);
                this.loadEditor();
            });
        } else {
            this.loadEditor();
        }
    }
});

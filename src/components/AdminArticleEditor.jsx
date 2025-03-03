import React, { useCallback, useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { createArticle } from '../services/api';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import useFetchAllArticles from '../hooks/useFetchAllArticles';
import useFetchCategory from '../hooks/useFetchCategory';
import '../styles/admincomponent.css';

function AdminArticleEditor() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category_id: '',
      tag_ids: '',
      status: 'draft',
      seo_title: '',
      meta_description: '',
      is_featured: false,
      related_articles: [],
      image: null,
    },
  });

  const mutation = useMutation(newArticle => createArticle(newArticle));

  // Fetch all articles for related articles select.
  const { data: allArticles = [] } = useFetchAllArticles();
  const articleOptions = useMemo(
    () =>
      allArticles.map(article => ({
        value: article.id,
        label: article.title,
        category: article.category ? article.category.name : 'No category',
      })),
    [allArticles]
  );

  // Fetch categories for the category dropdown.
  const { data: categories = [] } = useFetchCategory();
  const categoryOptions = useMemo(
    () =>
      categories.map(cat => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories]
  );

  // Featured image dropzone (single file)
  const [selectedFile, setSelectedFile] = useState(null);
  const onDropFeatured = useCallback(
    acceptedFiles => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setValue('image', acceptedFiles[0]);
      }
    },
    [setValue]
  );

  const {
    getRootProps: getRootPropsFeatured,
    getInputProps: getInputPropsFeatured,
    isDragActive: isDragActiveFeatured,
  } = useDropzone({
    onDrop: onDropFeatured,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Additional images dropzone (multiple files)
  const [additionalImages, setAdditionalImages] = useState([]);
  const onDropAdditional = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setAdditionalImages(prevFiles => [...prevFiles, ...acceptedFiles]);
    }
  }, []);

  const {
    getRootProps: getRootPropsAdditional,
    getInputProps: getInputPropsAdditional,
    isDragActive: isDragActiveAdditional,
  } = useDropzone({
    onDrop: onDropAdditional,
    accept: { 'image/*': [] },
    multiple: true,
  });

  // Handle form submission.
  const onSubmit = data => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('excerpt', data.excerpt);
    formData.append('category_id', data.category_id);
    formData.append(
      'tag_ids',
      JSON.stringify(data.tag_ids.split(',').map(tag => tag.trim()))
    );
    formData.append('status', data.status);
    formData.append('seo_title', data.seo_title);
    formData.append('meta_description', data.meta_description);
    formData.append('is_featured', data.is_featured);
    formData.append(
      'related_articles_ids',
      JSON.stringify(data.related_articles)
    );
    if (data.image) {
      formData.append('image', data.image);
    }
    additionalImages.forEach(file => {
      formData.append('additional_images', file);
    });
    mutation.mutate(formData);
  };

  return (
    <motion.div
      className="admin-article-editor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Create a New Article</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <span className="error">{errors.title.message}</span>
          )}
        </div>

        {/* Content using ReactQuill */}
        <div>
          <label htmlFor="content">Content:</label>
          <Controller
            control={control}
            name="content"
            rules={{ required: 'Content is required' }}
            render={({ field }) => (
              <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <span className="error">{errors.content.message}</span>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt">Excerpt:</label>
          <textarea id="excerpt" {...register('excerpt')} />
        </div>

        {/* Category Dropdown using CreatableSelect */}
        <div>
          <label htmlFor="category_id">Category:</label>
          <Controller
            control={control}
            name="category_id"
            rules={{ required: 'Category is required' }}
            render={({ field: { onChange, value } }) => (
              <CreatableSelect
                value={categoryOptions.find(option => option.value === value) || null}
                onChange={selectedOption =>
                  onChange(selectedOption ? selectedOption.value : null)
                }
                options={categoryOptions}
                placeholder="Select or create a category..."
                formatCreateLabel={inputValue => `Create "${inputValue}"`}
              />
            )}
          />
          {errors.category_id && (
            <span className="error">{errors.category_id.message}</span>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tag_ids">Tags (comma separated):</label>
          <input id="tag_ids" type="text" {...register('tag_ids')} />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status:</label>
          <select id="status" {...register('status')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* SEO Title */}
        <div>
          <label htmlFor="seo_title">SEO Title:</label>
          <input id="seo_title" type="text" {...register('seo_title')} />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="meta_description">Meta Description:</label>
          <textarea id="meta_description" {...register('meta_description')} />
        </div>

        {/* Is Featured */}
        <div>
          <label htmlFor="is_featured">Is Featured:</label>
          <input id="is_featured" type="checkbox" {...register('is_featured')} />
        </div>

        {/* Related Articles using react-select multi-select */}
        <div>
          <label htmlFor="related_articles">Related Articles:</label>
          <Controller
            control={control}
            name="related_articles"
            render={({ field: { onChange, value } }) => (
              <Select
                value={articleOptions.filter(option =>
                  (value || []).includes(option.value)
                )}
                options={articleOptions}
                isMulti
                onChange={selectedOptions =>
                  onChange(selectedOptions.map(opt => opt.value))
                }
                placeholder="Select related articles..."
                formatOptionLabel={option => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{option.label}</span>
                    <span style={{ marginLeft: '1rem', color: '#888' }}>{option.category}</span>
                  </div>
                )}
              />
            )}
          />
        </div>

        {/* Featured Image Upload */}
        <div>
          <label>Upload Featured Image:</label>
          <div
            {...getRootPropsFeatured({ className: 'dropzone' })}
            style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
          >
            <input {...getInputPropsFeatured()} />
            {isDragActiveFeatured ? (
              <p>Drop the featured image here...</p>
            ) : (
              <p>Drag 'n' drop a featured image here, or click to select one</p>
            )}
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
          </div>
        </div>

        {/* Additional Images Upload */}
        <div>
          <label>Upload Additional Images:</label>
          <div
            {...getRootPropsAdditional({ className: 'dropzone' })}
            style={{
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            <input {...getInputPropsAdditional()} />
            {isDragActiveAdditional ? (
              <p>Drop additional images here...</p>
            ) : (
              <p>Drag 'n' drop additional images here, or click to select</p>
            )}
            {additionalImages.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {additionalImages.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button type="submit">Submit Article</button>
      </form>

      {mutation.isLoading && <p>Submitting...</p>}
      {mutation.isError && (
        <p className="error">
          Error creating article: {mutation.error?.message || 'An unexpected error occurred.'}
        </p>
      )}
      {mutation.isSuccess && <p>Article created successfully!</p>}
    </motion.div>
  );
}

export default AdminArticleEditor;

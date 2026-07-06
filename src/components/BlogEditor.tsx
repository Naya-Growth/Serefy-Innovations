import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Eye, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  Settings, 
  X,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';

interface BlogEditorProps {
  onSave?: (data: BlogFormData) => void;
  onPublish?: (data: BlogFormData) => void;
  initialData?: Partial<BlogFormData>;
}

export interface BlogFormData {
  title: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
}

const categories = [
  'Technology',
  'Guide',
  'Business',
  'Sustainability',
  'Education',
  'Industry'
];

export default function BlogEditor({ onSave, onPublish, initialData }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    status: initialData?.status || 'draft',
    scheduledDate: initialData?.scheduledDate || ''
  });

  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'preview'>('content');
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const handlePublish = () => {
    onPublish?.({ ...formData, status: 'published' });
    setShowPublishModal(false);
  };

  const handleSchedule = () => {
    onPublish?.({ ...formData, status: 'scheduled' });
    setShowPublishModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900 font-bold text-sm">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                formData.status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : formData.status === 'scheduled'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {formData.status === 'published' ? 'Published' : formData.status === 'scheduled' ? 'Scheduled' : 'Draft'}
              </span>
              <span className="text-slate-400 text-sm">Last saved 2 min ago</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <Send size={16} />
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl mx-auto w-full p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'content' ? (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Blog title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent border-none"
                />

                {/* Content Editor */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 min-h-[500px]">
                  <textarea
                    placeholder="Start writing your blog post..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full h-full min-h-[450px] resize-none outline-none text-slate-700 leading-relaxed placeholder:text-slate-300"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-8"
              >
                <h1 className="text-4xl font-bold text-slate-900 mb-6">{formData.title || 'Untitled'}</h1>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-600 whitespace-pre-wrap">{formData.content || 'No content yet...'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 space-y-6">
          {/* Featured Image */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">Featured Image</h3>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
              {formData.featuredImage ? (
                <div className="relative">
                  <img src={formData.featuredImage} alt="Featured" className="w-full h-32 object-cover rounded" />
                  <button
                    onClick={() => setFormData({ ...formData, featuredImage: '' })}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload image</p>
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">Category</h3>
            </div>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-emerald-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* SEO Settings */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">SEO</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">SEO Title</label>
                <input
                  type="text"
                  placeholder="SEO title..."
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Meta Description</label>
                <textarea
                  placeholder="Meta description..."
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">Publish Settings</h3>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Schedule Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPublishModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Publish Blog</h2>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={handlePublish}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Send size={18} />
                  Publish Now
                </button>
                
                {formData.scheduledDate && (
                  <button
                    onClick={handleSchedule}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calendar size={18} />
                    Schedule for {new Date(formData.scheduledDate).toLocaleDateString()}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setFormData({ ...formData, status: 'draft' });
                    setShowPublishModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Save size={18} />
                  Save as Draft
                </button>
              </div>
              
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-full text-center text-slate-500 hover:text-slate-700 font-bold text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { useState } from 'preact/hooks';
import cn from 'classnames';
import { useNav } from '../navigation';
import { Stack } from '../../shared/js/ui/components/stack';

// Feature options that can be easily modified
const FEATURE_OPTIONS = [
    { id: 'reader-mode', label: 'Reader mode' },
    { id: 'password-manager', label: 'Password manager extensions' },
    { id: 'ad-blocking', label: 'Advanced ad blocking' },
    { id: 'new-tab-widgets', label: 'New tab page widgets' },
    { id: 'website-translation', label: 'Website translation' },
    { id: 'incognito', label: 'Incognito' },
    { id: 'user-profiles', label: 'User profiles' },
    { id: 'import-bookmarks', label: 'Import bookmarks folders' },
    { id: 'vertical-tabs', label: 'Vertical tabs' },
    { id: 'picture-in-picture', label: 'Picture-in-picture' },
    { id: 'cast-media', label: 'Cast video/audio' },
    { id: 'tab-groups', label: 'Tab groups' },
];

/**
 * Header component with title and subtitle
 */
function RequestFeatureHeader() {
    return (
        <div className="padding-x-double">
            <div className="request-feature-header">
                <div className="icon-request-feature-header"></div>
                <div className="request-feature-text">
                    <h1 className="request-feature-title">Request a New Feature</h1>
                    <p className="request-feature-subtitle">Select all that apply</p>
                </div>
            </div>
        </div>
    );
}

/**
 * Individual feature pill component
 */
function FeaturePill({ feature, isSelected, onToggle }) {
    const handleClick = () => {
        onToggle(feature.id);
    };

    return (
        <button
            className={cn('feature-pill', { 'feature-pill--selected': isSelected })}
            onClick={handleClick}
            type="button"
        >
            {feature.label}
        </button>
    );
}

/**
 * Grid of selectable feature pills
 */
function FeaturePillsList({ selectedFeatures, onToggleFeature }) {
    return (
        <div className="padding-x">
            <div className="feature-pills-grid">
                {FEATURE_OPTIONS.map((feature) => (
                    <FeaturePill
                        key={feature.id}
                        feature={feature}
                        isSelected={selectedFeatures.includes(feature.id)}
                        onToggle={onToggleFeature}
                    />
                ))}
            </div>
        </div>
    );
}

/**
 * Custom feature input section
 */
function CustomFeatureInput({ value, onChange }) {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="padding-x">
            <div className="custom-feature-input">
                <label className="custom-feature-label">Or share your own feature idea</label>
                <textarea
                    className="custom-feature-textarea"
                    placeholder="The more details you share, the better!"
                    value={value}
                    onChange={handleChange}
                    rows="4"
                />
            </div>
        </div>
    );
}

/**
 * Action buttons (Cancel and Submit)
 */
function ActionButtons({ onCancel, onSubmit, isSubmitDisabled }) {
    return (
        <div className="padding-x">
            <div className="action-buttons">
                <button
                    className="action-button action-button"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </button>
                <button
                    className="action-button action-button"
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                    type="button"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

/**
 * Main Request Feature Form Screen
 */
export function RequestFeatureFormScreen() {
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [customFeatureText, setCustomFeatureText] = useState('');
    const { pop } = useNav();

    const handleToggleFeature = (featureId) => {
        setSelectedFeatures(prev => 
            prev.includes(featureId)
                ? prev.filter(id => id !== featureId)
                : [...prev, featureId]
        );
    };

    const handleCancel = () => {
        // Reset form and navigate back
        setSelectedFeatures([]);
        setCustomFeatureText('');
        pop();
    };

    const handleSubmit = () => {
        // Check if user has selected at least one feature or entered custom text
        if (selectedFeatures.length === 0 && customFeatureText.trim() === '') {
            alert('Please select at least one feature or describe your own feature idea.');
            return;
        }

        // TODO: Implement actual submission logic
        console.log('Selected features:', selectedFeatures);
        console.log('Custom feature text:', customFeatureText);
        
        // For now, just show an alert and navigate back
        alert('Feature request submitted! Thank you for your feedback.');
        handleCancel();
    };

    const isSubmitDisabled = selectedFeatures.length === 0 && customFeatureText.trim() === '';

    return (
        <div className="site-info page">
            <div className="page-inner request-feature-form">
                <Stack gap="24px">
                    <RequestFeatureHeader />
                    <FeaturePillsList 
                        selectedFeatures={selectedFeatures}
                        onToggleFeature={handleToggleFeature}
                    />
                    <CustomFeatureInput 
                        value={customFeatureText}
                        onChange={setCustomFeatureText}
                    />
                    <ActionButtons 
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                        isSubmitDisabled={isSubmitDisabled}
                    />
                </Stack>
            </div>
        </div>
    );
} 
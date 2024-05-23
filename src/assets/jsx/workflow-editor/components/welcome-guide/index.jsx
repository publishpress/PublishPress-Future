import { Guide } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as editorStore } from "../editor-store";
import { useDispatch } from "@wordpress/data";
import { FEATURE_WELCOME_GUIDE } from "../../constants";

export function WelcomeGuide() {

    const {
        disableFeature,
    } = useDispatch(editorStore);

    return (
        <Guide
            className="workflow-editor-welcome-guide"
            contentLabel={__("Welcome to workflow editor", 'publishpress-future-pro')}
            finishButtonText={__("Get started", 'publishpress-future-pro')}
            onFinish={() => {
                disableFeature(FEATURE_WELCOME_GUIDE);
            }}
            pages={
                [
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Welcome to workflow editor", 'publishpress-future-pro')}
                                content={__("In the PublishPress Workflow Editor, each workflow step is presented as a distinct 'node' in the workflow.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Use your imagination", 'publishpress-future-pro')}
                                content={__("You're free to create very distinct workflows in your site, according to your needs.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("A basic workflow", 'publishpress-future-pro')}
                                content={__("Every workflow requires at least two steps connected to each other: one trigger and one action.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Add steps to your workflow", 'publishpress-future-pro')}
                                content={__("Drag and drop steps from the inserter to add them to your workflow, and connect them to create a flow.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Output and input", 'publishpress-future-pro')}
                                content={__("Linked nodes can pass data forward as input to the next node.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Customize the workflow", 'publishpress-future-pro')}
                                content={__("Click on a step to customize it. You can change the step's settings in the right sidebar.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Workflow validation", 'publishpress-future-pro')}
                                content={__("Error marks will appear atop nodes for any unfilled required settings, missed connections, or invalid values. Select the node to view the corresponding error in the sidebar.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Publish your workflow", 'publishpress-future-pro')}
                                content={__("When you're ready, click the publish button to make your workflow live.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                    {
                        image: (
                            <WelcomeGuideImage
                                nonAnimatedSrc="https://s.w.org/images/block-editor/welcome-canvas.svg"
                                animatedSrc="https://s.w.org/images/block-editor/welcome-canvas.gif"
                            />
                        ),
                        content: (
                            <WelcomeGuideContent
                                title={__("Need help?", 'publishpress-future-pro')}
                                content={__("If you have any questions or need help, click the help button in the top right corner to access the support resources.", 'publishpress-future-pro')}
                            />
                        ),
                    },
                ]
            }
        />
    )
}

export default WelcomeGuide;

function WelcomeGuideImage( { nonAnimatedSrc, animatedSrc } ) {
	return (
		<picture className="edit-post-welcome-guide__image">
			<source
				srcSet={ nonAnimatedSrc }
				media="(prefers-reduced-motion: reduce)"
			/>
			<img src={ animatedSrc } width="312" height="240" alt="" />
		</picture>
	);
}

function WelcomeGuideContent( { title, content } ) {
    return (
        <>
            <h1 className="edit-post-welcome-guide__heading">{ title }</h1>
            <p className="edit-post-welcome-guide__text">{ content }</p>
        </>
    );
}

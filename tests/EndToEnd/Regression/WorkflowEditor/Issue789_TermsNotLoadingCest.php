<?php


namespace Tests\EndToEnd\Regression\WorkflowEditor;

use Tests\Support\EndToEndTester;

class Issue789_TermsNotLoadingCest
{
    public function test_terms_are_loaded_when_node_is_selected(EndToEndTester $I)
    {
        $I->loginAsAdmin();

        $postId = $I->haveWorkflowInDatabase(
            [
                'flow' => '{"nodes":[{"id":"onSavePost_fv6u3pk","type":"trigger","position":{"x":0,"y":0},"data":{"name":"trigger\/core.save-post","elementaryType":"trigger","version":2,"slug":"onSavePost1","settings":{"postQuery":{"postSource":"custom","postType":["post"],"postId":[],"postStatus":[]}}},"width":140,"height":65,"positionAbsolute":{"x":0,"y":0}},{"id":"addPostTerms_fv6u7vv","type":"generic","position":{"x":0,"y":140},"data":{"name":"action\/core.add-post-terms","elementaryType":"action","version":1,"slug":"addPostTerms1","settings":{"taxonomyTerms":{"taxonomy":"category","terms":[1]},"post":{"variable":"onSavePost1.post"}}},"width":150,"height":65,"selected":true,"positionAbsolute":{"x":0,"y":140},"dragging":false}],"edges":[{"source":"onSavePost_fv6u3pk","sourceHandle":"output","target":"addPostTerms_fv6u7vv","targetHandle":"input","type":"genericEdge","id":"onSavePost_fv6u3pk-output-addPostTerms_fv6u7vv-input","markerEnd":{"type":"arrowclosed"}}],"viewport":{"x":345,"y":325.5,"zoom":2},"editorVersion":"3.4.2"}',
            ]
        );

        $I->amOnWorkflowEditorPage($postId);
        $I->selectWorkflowStep('addPostTerms_fv6u7vv');
        $I->see('Uncategorized', '.components-form-token-field__input-container.future-taxonomy-terms');
    }
}

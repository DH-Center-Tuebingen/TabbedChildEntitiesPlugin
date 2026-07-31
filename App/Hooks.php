<?php

namespace App\Plugins\TabbedChildEntities\App;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Entity;

class Hooks {

    // const NAME = 'tabbed_child_entities';

    // public function entityUpdate(Request $request, JsonResponse $response) {
    //     $entityId = $request->route('id');
    //     $useTabbedChildren = $request->input("plugin_data." . static::NAME . ".tabbed", false);
    //     TabbedChildEntities::updateData($entityId, $useTabbedChildren);
    //     return $response;
    // }

    // public function global(Request $request, JsonResponse $response) {
    //     $data = $response->getData(true);
    //     $ids = array_values(array_map(fn($value): int => $value['id'], $data['entityTypes']));
    //     $tabbedEntityTypes = TabbedChildEntities::activeIds($ids);

    //     foreach ($data['entityTypes'] as $key => $entityType) {
    //         if (!isset($entityType['plugin_data'])) {
    //             $entityType['plugin_data'] = [];
    //         }

    //         if (!isset($entityType['plugin_data'][static::NAME])) {
    //             $entityType['plugin_data'][static::NAME] = [];
    //         }

    //         $entityType['plugin_data'][static::NAME]['tabbed'] = in_array($entityType['id'], $tabbedEntityTypes);
    //         $data['entityTypes'][$key] = $entityType;
    //     }

    //     $response->setData($data);
    //     return $response;
    // }


    public function addChildrenToEntity(Request $request, JsonResponse $response) {
        $data = $response->getData(true);
        $entityId = $request->route('id');

        $entityTypeId = Entity::find($entityId)->entity_type_id;

        if (!$entityTypeId || !in_array($entityTypeId, TabbedChildEntities::activeIds([$entityTypeId]))) {
            return $response;
        }

        $data['tabbed_child_entities'] = [];
        \App\Entity::where('root_entity_id', $entityId)->orderBy('rank')->get()->each(function ($child) use (&$data) {
            $entityData = [];
            $entityData['id'] = $child->id;
            $entityData['name'] = $child->name;
            $entityData['type'] = $child->entity_type_id;
            $entityData['entity_type_name'] = $child->entity_type->name;
            $entityData['rank'] = $child->rank;

            $entityData['data'] = $child->getData();
            $data['tabbed_child_entities'][] = $entityData;
        });

        $response->setData($data);

        return $response;
    }
}

